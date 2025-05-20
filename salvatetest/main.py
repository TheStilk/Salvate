import os
import json
from typing import Dict, Optional, Callable, Awaitable
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response as StarletteResponse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOCALES_DIR = os.path.join(BASE_DIR, "locales")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

DEFAULT_LANGUAGE = "en"
# Языки, для которых у вас есть файлы .json в папке locales
SUPPORTED_LANGUAGES = ["en", "ru"] 

# Словарь для хранения загруженных переводов
# Он будет заполнен при старте приложения через lifespan функцию
app_translations: Dict[str, Dict[str, str]] = {}


# --- Управление жизненным циклом для загрузки переводов при старте ---
async def lifespan(app_instance: FastAPI): # app_instance - это FastAPI app
    # Загрузка переводов при старте
    print(f"Loading translations from: {LOCALES_DIR}")
    for lang_code in SUPPORTED_LANGUAGES:
        file_path = os.path.join(LOCALES_DIR, f"{lang_code}.json")
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                app_translations[lang_code] = json.load(f)
                print(f"Successfully loaded translations for: {lang_code}")
        except FileNotFoundError:
            print(f"Warning: Translation file not found for language '{lang_code}' at {file_path}")
        except json.JSONDecodeError as e:
            print(f"Warning: Could not decode JSON for language '{lang_code}' at {file_path}. Error: {e}")
    
    if DEFAULT_LANGUAGE not in app_translations:
        # Если переводы для языка по умолчанию не загружены, это проблема.
        # Можно либо прекратить работу, либо работать с пустыми переводами.
        print(f"CRITICAL: Default language '{DEFAULT_LANGUAGE}' translations not loaded. Application might not work as expected.")
        # Здесь можно добавить app_translations[DEFAULT_LANGUAGE] = {} чтобы избежать KeyError дальше,
        # но лучше убедиться, что файл существует.
        if not app_translations.get(DEFAULT_LANGUAGE): # Добавляем пустой словарь если его нет
            app_translations[DEFAULT_LANGUAGE] = {}

    yield # Приложение работает здесь

    # Очистка при остановке (если необходимо)
    app_translations.clear()
    print("Translations cleared on application shutdown.")


app = FastAPI(lifespan=lifespan)

# --- Логика определения языка ---
def get_language_from_request(request: Request) -> str:
    # 1. Из query параметра ?lang=
    lang_code = request.query_params.get("lang")
    if lang_code and lang_code in SUPPORTED_LANGUAGES:
        return lang_code

    # 2. Из cookie
    lang_code = request.cookies.get("user_locale")
    if lang_code and lang_code in SUPPORTED_LANGUAGES:
        return lang_code

    # 3. Из заголовка Accept-Language
    accept_language = request.headers.get("accept-language")
    if accept_language:
        # Пример: "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
        # Берем первый самый предпочтительный язык
        # Разбиваем по запятой, берем первый элемент, отбрасываем ;q=...
        try:
            preferred_language_part = accept_language.split(",")[0].split(";")[0].strip().lower()
            # Проверяем основной код языка (например, "ru" из "ru-ru")
            base_lang_code = preferred_language_part.split("-")[0]
            if base_lang_code in SUPPORTED_LANGUAGES:
                return base_lang_code
            # Если был полный код (например, "en-us") и он поддерживается (если вы используете такие коды)
            if preferred_language_part in SUPPORTED_LANGUAGES:
                 return preferred_language_part
        except IndexError:
            pass # Некорректный формат заголовка

    return DEFAULT_LANGUAGE

# --- Middleware для добавления локали и функции перевода в request.state ---
class CustomI18nMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[StarletteResponse]]
    ):
        current_locale = get_language_from_request(request)
        request.state.locale = current_locale

        def translate_func(key: str, **kwargs) -> str:
            # Получаем переводы для текущей локали, или для языка по умолчанию, или пустой словарь
            lang_translations = app_translations.get(current_locale, app_translations.get(DEFAULT_LANGUAGE, {}))
            
            # Получаем строку перевода, если нет - возвращаем сам ключ (чтобы было видно, что не переведено)
            translation_template = lang_translations.get(key, key) 
            
            try:
                # Поддерживаем %-форматирование для совместимости с примером JSON
                # (например, "Current language is: %(lang)s")
                if kwargs and '%' in translation_template:
                    return translation_template % kwargs
                return translation_template
            except (TypeError, KeyError, ValueError) as e: 
                # В случае ошибки форматирования, возвращаем шаблон или ключ
                # Это может случиться, если в строке есть %, но kwargs не переданы, или наоборот
                print(f"Warning: Translation formatting error for key '{key}' in locale '{current_locale}'. Error: {e}. Template: '{translation_template}'")
                return translation_template # или key

        request.state.gettext = translate_func # Сохраняем саму функцию
        response = await call_next(request)
        return response

app.add_middleware(CustomI18nMiddleware)


# Настройка шаблонизатора Jinja2
templates = Jinja2Templates(directory=TEMPLATES_DIR)

# Основной эндпоинт для отображения страницы
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    # Middleware уже добавил locale и gettext в request.state
    current_locale = request.state.locale
    translator = request.state.gettext

    # Для отображения имени языка (например, "English" вместо "en")
    lang_display_names = {
        "en": "English",
        "ru": "Русский"
        # Добавьте другие языки по мере необходимости
    }
    current_locale_display_name = lang_display_names.get(current_locale, current_locale.upper())

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "_": translator, # Передаем функцию перевода в шаблон
            "current_locale": current_locale,
            "current_locale_display_name": current_locale_display_name
        }
    )

# Эндпоинт для смены языка
@app.get("/set-lang/{lang_code}")
async def set_language(lang_code: str, request: Request):
    # Редирект на предыдущую страницу или на главную, если referer не указан
    referer_url = request.headers.get("referer", request.url_for("read_root"))
    response = RedirectResponse(url=referer_url, status_code=302)

    if lang_code in SUPPORTED_LANGUAGES:
        # Устанавливаем cookie с выбором языка на 30 дней
        response.set_cookie(key="user_locale", value=lang_code, max_age=30*24*60*60, httponly=True, samesite="lax")
    return response

# Блок для прямого запуска файла `python main.py` (опционально)
if __name__ == "__main__":
    import uvicorn
    # При запуске через `python main.py` uvicorn не будет использовать --reload автоматически
    # Для разработки удобнее `uvicorn main:app --reload`
    uvicorn.run(app, host="0.0.0.0", port=8000)
