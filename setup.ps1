```powershell
# ============================================================
# ElectronHub — project architecture setup
# ============================================================
# Запуск:
#   .\setup.ps1
#
# Скрипт:
# - создаёт необходимые папки
# - создаёт отсутствующие файлы
# - НЕ удаляет существующие файлы
# - НЕ перезаписывает существующие файлы
# - НЕ трогает node_modules и .next
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "       ElectronHub architecture setup       " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# ------------------------------------------------------------
# Корень проекта
# ------------------------------------------------------------

$Root = Get-Location

Write-Host "Project root:" -ForegroundColor DarkGray
Write-Host $Root
Write-Host ""

# ------------------------------------------------------------
# Папки
# ------------------------------------------------------------

$folders = @(
    # --------------------------------------------------------
    # APP / SITE
    # --------------------------------------------------------

    "src\app\(site)",
    "src\app\(site)\datasheets",
    "src\app\(site)\datasheets\[category]",
    "src\app\(site)\components",
    "src\app\(site)\components\[slug]",
    "src\app\(site)\manufacturers",
    "src\app\(site)\manufacturers\[slug]",
    "src\app\(site)\categories",
    "src\app\(site)\categories\[slug]",
    "src\app\(site)\search",

    # Теория
    "src\app\(site)\theory",
    "src\app\(site)\theory\[category]",
    "src\app\(site)\theory\[slug]",

    # Принципиальные схемы
    "src\app\(site)\circuits",
    "src\app\(site)\circuits\[category]",
    "src\app\(site)\circuits\[slug]",

    # Онлайн калькуляторы
    "src\app\(site)\calculators",
    "src\app\(site)\calculators\resistor",
    "src\app\(site)\calculators\capacitor",
    "src\app\(site)\calculators\ohm-law",
    "src\app\(site)\calculators\[slug]",

    # Полезные схемы
    "src\app\(site)\useful-circuits",
    "src\app\(site)\useful-circuits\[category]",
    "src\app\(site)\useful-circuits\[slug]",

    # --------------------------------------------------------
    # ADMIN
    # --------------------------------------------------------

    "src\app\admin",
    "src\app\admin\components",
    "src\app\admin\manufacturers",
    "src\app\admin\categories",
    "src\app\admin\datasheets",
    "src\app\admin\theory",
    "src\app\admin\circuits",
    "src\app\admin\calculators",
    "src\app\admin\useful-circuits",
    "src\app\admin\settings",

    # --------------------------------------------------------
    # API
    # --------------------------------------------------------

    "src\app\api\search",
    "src\app\api\upload",
    "src\app\api\datasheets",
    "src\app\api\theory",
    "src\app\api\circuits",
    "src\app\api\calculators",
    "src\app\api\useful-circuits",

    # --------------------------------------------------------
    # UI COMPONENTS
    # --------------------------------------------------------

    "src\components\ui",

    # Layout
    "src\components\layout",

    # Navigation
    "src\components\navigation",

    # Datasheets
    "src\components\datasheets",

    # Manufacturers
    "src\components\manufacturers",

    # Theory
    "src\components\theory",

    # Circuits
    "src\components\circuits",

    # Calculators
    "src\components\calculators",

    # Useful circuits
    "src\components\useful-circuits",

    # Search
    "src\components\search",

    # --------------------------------------------------------
    # DATABASE / DRIZZLE
    # --------------------------------------------------------

    "src\db",
    "src\db\schema",

    # --------------------------------------------------------
    # SERVER
    # --------------------------------------------------------

    "src\server",

    "src\server\components",
    "src\server\manufacturers",
    "src\server\categories",
    "src\server\datasheets",
    "src\server\theory",
    "src\server\circuits",
    "src\server\calculators",
    "src\server\useful-circuits",
    "src\server\storage",

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    "src\validations",

    # --------------------------------------------------------
    # CONFIG
    # --------------------------------------------------------

    "src\config",

    # --------------------------------------------------------
    # LIB
    # --------------------------------------------------------

    "src\lib",
    "src\lib\calculators",

    # --------------------------------------------------------
    # TYPES
    # --------------------------------------------------------

    "src\types",

    # --------------------------------------------------------
    # PUBLIC
    # --------------------------------------------------------

    "public\images",
    "public\images\components",
    "public\images\theory",
    "public\images\circuits",
    "public\images\useful-circuits",
    "public\icons",

    # --------------------------------------------------------
    # DRIZZLE
    # --------------------------------------------------------

    "drizzle"
)

# ------------------------------------------------------------
# Создание папок
# ------------------------------------------------------------

Write-Host "Creating directories..." -ForegroundColor Yellow

foreach ($folder in $folders) {

    $path = Join-Path $Root $folder

    if (-not (Test-Path -LiteralPath $path)) {

        New-Item `
            -ItemType Directory `
            -Path $path `
            -Force | Out-Null

        Write-Host "  + $folder" -ForegroundColor Green
    }
    else {

        Write-Host "  = $folder" -ForegroundColor DarkGray
    }
}

Write-Host ""

# ------------------------------------------------------------
# Файлы
# ------------------------------------------------------------

$files = @(

    # ========================================================
    # APP
    # ========================================================

    "src\app\(site)\page.tsx",
    "src\app\(site)\layout.tsx",

    # Datasheets
    "src\app\(site)\datasheets\page.tsx",
    "src\app\(site)\datasheets\[category]\page.tsx",

    # Components
    "src\app\(site)\components\[slug]\page.tsx",

    # Manufacturers
    "src\app\(site)\manufacturers\page.tsx",
    "src\app\(site)\manufacturers\[slug]\page.tsx",

    # Categories
    "src\app\(site)\categories\page.tsx",
    "src\app\(site)\categories\[slug]\page.tsx",

    # Search
    "src\app\(site)\search\page.tsx",

    # Theory
    "src\app\(site)\theory\page.tsx",
    "src\app\(site)\theory\[category]\page.tsx",
    "src\app\(site)\theory\[slug]\page.tsx",

    # Circuits
    "src\app\(site)\circuits\page.tsx",
    "src\app\(site)\circuits\[category]\page.tsx",
    "src\app\(site)\circuits\[slug]\page.tsx",

    # Calculators
    "src\app\(site)\calculators\page.tsx",
    "src\app\(site)\calculators\resistor\page.tsx",
    "src\app\(site)\calculators\capacitor\page.tsx",
    "src\app\(site)\calculators\ohm-law\page.tsx",
    "src\app\(site)\calculators\[slug]\page.tsx",

    # Useful circuits
    "src\app\(site)\useful-circuits\page.tsx",
    "src\app\(site)\useful-circuits\[category]\page.tsx",
    "src\app\(site)\useful-circuits\[slug]\page.tsx",

    # System
    "src\app\error.tsx",
    "src\app\not-found.tsx",
    "src\app\globals.css",
    "src\app\layout.tsx",

    # ========================================================
    # ADMIN
    # ========================================================

    "src\app\admin\page.tsx",

    # ========================================================
    # UI
    # ========================================================

    "src\components\ui\button.tsx",
    "src\components\ui\input.tsx",
    "src\components\ui\card.tsx",
    "src\components\ui\badge.tsx",
    "src\components\ui\dialog.tsx",

    # ========================================================
    # LAYOUT
    # ========================================================

    "src\components\layout\header.tsx",
    "src\components\layout\footer.tsx",
    "src\components\layout\container.tsx",

    # ========================================================
    # NAVIGATION
    # ========================================================

    "src\components\navigation\main-nav.tsx",
    "src\components\navigation\breadcrumbs.tsx",
    "src\components\navigation\mobile-nav.tsx",

    # ========================================================
    # DATASHEETS
    # ========================================================

    "src\components\datasheets\datasheet-card.tsx",
    "src\components\datasheets\datasheet-list.tsx",
    "src\components\datasheets\datasheet-details.tsx",
    "src\components\datasheets\datasheet-download.tsx",
    "src\components\datasheets\datasheet-search.tsx",

    # ========================================================
    # MANUFACTURERS
    # ========================================================

    "src\components\manufacturers\manufacturer-card.tsx",
    "src\components\manufacturers\manufacturer-list.tsx",

    # ========================================================
    # THEORY
    # ========================================================

    "src\components\theory\theory-card.tsx",
    "src\components\theory\theory-list.tsx",
    "src\components\theory\theory-content.tsx",
    "src\components\theory\theory-navigation.tsx",

    # ========================================================
    # CIRCUITS
    # ========================================================

    "src\components\circuits\circuit-card.tsx",
    "src\components\circuits\circuit-list.tsx",
    "src\components\circuits\circuit-viewer.tsx",
    "src\components\circuits\circuit-details.tsx",
    "src\components\circuits\circuit-download.tsx",

    # ========================================================
    # CALCULATORS
    # ========================================================

    "src\components\calculators\calculator-card.tsx",
    "src\components\calculators\calculator-layout.tsx",
    "src\components\calculators\resistor-calculator.tsx",
    "src\components\calculators\capacitor-calculator.tsx",
    "src\components\calculators\ohm-law-calculator.tsx",

    # ========================================================
    # USEFUL CIRCUITS
    # ========================================================

    "src\components\useful-circuits\useful-circuit-card.tsx",
    "src\components\useful-circuits\useful-circuit-list.tsx",
    "src\components\useful-circuits\useful-circuit-details.tsx",

    # ========================================================
    # SEARCH
    # ========================================================

    "src\components\search\search-form.tsx",
    "src\components\search\search-results.tsx",

    # ========================================================
    # DATABASE
    # ========================================================

    "src\db\index.ts",

    "src\db\schema\components.ts",
    "src\db\schema\manufacturers.ts",
    "src\db\schema\categories.ts",
    "src\db\schema\datasheets.ts",
    "src\db\schema\files.ts",
    "src\db\schema\theory.ts",
    "src\db\schema\circuits.ts",
    "src\db\schema\calculators.ts",
    "src\db\schema\useful-circuits.ts",
    "src\db\schema\index.ts",

    # ========================================================
    # SERVER
    # ========================================================

    "src\server\components\queries.ts",
    "src\server\components\mutations.ts",
    "src\server\components\services.ts",

    "src\server\manufacturers\queries.ts",
    "src\server\manufacturers\mutations.ts",

    "src\server\categories\queries.ts",
    "src\server\categories\mutations.ts",

    "src\server\datasheets\queries.ts",
    "src\server\datasheets\mutations.ts",
    "src\server\datasheets\services.ts",

    "src\server\theory\queries.ts",
    "src\server\theory\mutations.ts",
    "src\server\theory\services.ts",

    "src\server\circuits\queries.ts",
    "src\server\circuits\mutations.ts",
    "src\server\circuits\services.ts",

    "src\server\calculators\queries.ts",
    "src\server\calculators\mutations.ts",
    "src\server\calculators\services.ts",

    "src\server\useful-circuits\queries.ts",
    "src\server\useful-circuits\mutations.ts",
    "src\server\useful-circuits\services.ts",

    "src\server\storage\upload.ts",
    "src\server\storage\delete.ts",
    "src\server\storage\storage.ts",

    # ========================================================
    # VALIDATIONS
    # ========================================================

    "src\validations\component.ts",
    "src\validations\manufacturer.ts",
    "src\validations\category.ts",
    "src\validations\datasheet.ts",
    "src\validations\theory.ts",
    "src\validations\circuit.ts",
    "src\validations\calculator.ts",
    "src\validations\useful-circuit.ts",

    # ========================================================
    # CONFIG
    # ========================================================

    "src\config\site.ts",
    "src\config\navigation.ts",

    # ========================================================
    # LIB
    # ========================================================

    "src\lib\utils.ts",
    "src\lib\env.ts",
    "src\lib\errors.ts",

    # Calculator logic
    "src\lib\calculators\ohm-law.ts",
    "src\lib\calculators\resistor.ts",
    "src\lib\calculators\capacitor.ts",
    "src\lib\calculators\led-resistor.ts",

    # ========================================================
    # TYPES
    # ========================================================

    "src\types\component.ts",
    "src\types\manufacturer.ts",
    "src\types\category.ts",
    "src\types\datasheet.ts",
    "src\types\theory.ts",
    "src\types\circuit.ts",
    "src\types\calculator.ts",
    "src\types\useful-circuit.ts",

    # ========================================================
    # ROOT CONFIG
    # ========================================================

    "drizzle.config.ts",
    ".env.example",
    "README.md"
)

# ------------------------------------------------------------
# Создание файлов
# ------------------------------------------------------------

Write-Host "Creating files..." -ForegroundColor Yellow

foreach ($file in $files) {

    $path = Join-Path $Root $file

    if (-not (Test-Path -LiteralPath $path)) {

        # Проверяем существование родительской папки
        $parent = Split-Path -Parent $path

        if (-not (Test-Path -LiteralPath $parent)) {
            New-Item `
                -ItemType Directory `
                -Path $parent `
                -Force | Out-Null
        }

        New-Item `
            -ItemType File `
            -Path $path `
            -Force | Out-Null

        Write-Host "  + $file" -ForegroundColor Green
    }
    else {

        Write-Host "  = $file" -ForegroundColor DarkGray
    }
}

# ------------------------------------------------------------
# Финальная информация
# ------------------------------------------------------------

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host " ElectronHub architecture created!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

Write-Host "Existing files were NOT overwritten." -ForegroundColor Cyan
Write-Host "node_modules and .next were NOT touched." -ForegroundColor Cyan
Write-Host ""

Write-Host "Main sections:" -ForegroundColor Yellow
Write-Host "  /components"
Write-Host "  /datasheets"
Write-Host "  /manufacturers"
Write-Host "  /categories"
Write-Host "  /theory"
Write-Host "  /circuits"
Write-Host "  /calculators"
Write-Host "  /useful-circuits"
Write-Host ""

Write-Host "Next step:" -ForegroundColor Yellow
Write-Host "  npm run dev"
Write-Host ""
```
