<template>
  <B24App>
    <div class="w-full h-full p-4 space-y-4">
      <!-- Дисплей калькулятора -->
      <B24Card class="overflow-hidden">
        <div class="p-3 relative">
          <!-- Кнопка справки в левом верхнем углу -->
          <div class="absolute left-3 top-3 z-10">
            <div
                class="w-6 h-6 rounded-full bg-b24-surface-hover flex items-center justify-center cursor-pointer hover:bg-b24-border transition-colors"
                @click="showHelpModal = true"
                @mouseenter="helpTooltip = true"
                @mouseleave="helpTooltip = false"
            >
              <span class="text-sm text-b24-text-secondary">?</span>
              <!-- Всплывающая подсказка -->
              <div
                  v-if="helpTooltip"
                  class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-b24-surface-popover text-xs text-b24-text-primary px-2 py-1 rounded shadow-lg whitespace-nowrap z-50"
              >
                Справка по калькулятору
              </div>
            </div>
          </div>

          <div class="text-right space-y-0 pl-8">
            <!-- История вычислений -->
            <div
                v-if="previousExpression"
                class="text-sm text-b24-text-secondary min-h-[16px] font-mono truncate"
            >
              {{ previousExpression }}
            </div>

            <!-- Текущий ввод через input -->
            <div class="relative">
              <input
                  ref="inputRef"
                  v-model="currentExpression"
                  type="text"
                  class="w-full text-right text-xl font-semibold text-b24-text-primary bg-transparent border-none outline-none calculator-input"
                  @keydown="handleKeyDown"
                  @input="onExpressionChange"
                  @focus="onInputFocus"
                  @blur="onInputBlur"
                  :placeholder="inputPlaceholder"
                  spellcheck="false"
              />
              <div class="absolute right-0 top-0 bottom-0 w-0 opacity-0 pointer-events-none">
                {{ currentExpression }}
              </div>
            </div>

            <!-- Результат с разделительной чертой -->
            <div class="border-t border-b24-border pt-1 mt-1">
              <div class="text-lg font-bold text-b24-primary truncate calculator-display" style="min-height: 24px;">
                = {{ formattedResult }}
              </div>
            </div>
          </div>
        </div>
      </B24Card>

      <!-- Кнопки быстрых действий -->
      <div class="flex items-center justify-between">
        <div class="flex space-x-2 w-full">
          <B24Button
              size="sm"
              variant="secondary"
              @click="copyToClipboard"
              class="text-xs w-full justify-center"
          >
            Копировать
          </B24Button>
          <B24Button
              v-if="sendBtnActive"
              size="sm"
              variant="primary"
              @click="sendToChat"
              class="text-xs w-full justify-center"
          >
            Отправить
          </B24Button>
        </div>
      </div>

      <!-- Аккордеон для клавиатуры -->
      <B24Card class="overflow-hidden">
        <div
            class="cursor-pointer flex items-center justify-between hover:bg-b24-surface-hover transition-colors p-3"
            @click="toggleKeyboard"
        >
          <h3 class="text-sm font-semibold text-b24-text-primary">Клавиатура калькулятора</h3>
          <div class="transform transition-transform" :class="{ 'rotate-180': keyboardOpen }">
            <i class="fas fa-chevron-down text-b24-text-secondary"></i>
          </div>
        </div>

        <!-- Клавиши калькулятора (скрываемое содержимое) -->
        <div v-if="keyboardOpen" class="pt-3 pb-3 px-3">
          <div class="grid grid-cols-4 gap-2 mt-3">
            <!-- Функциональные клавиши -->
            <B24Button
                size="lg"
                variant="secondary"
                @click="clear"
                class="calc-btn"
            >
              C
            </B24Button>
            <B24Button
                size="lg"
                variant="secondary"
                @click="backspace"
                class="calc-btn"
            >
              ⌫
            </B24Button>
            <B24Button
                size="lg"
                variant="secondary"
                @click="addPercentage"
                class="calc-btn"
            >
              %
            </B24Button>
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('/')"
                class="calc-btn calc-btn-operation"
            >
              ÷
            </B24Button>

            <!-- Цифры 7-9 -->
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('7')"
                class="calc-btn calc-btn-number"
            >
              7
            </B24Button>
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('8')"
                class="calc-btn calc-btn-number"
            >
              8
            </B24Button>
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('9')"
                class="calc-btn calc-btn-number"
            >
              9
            </B24Button>
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('*')"
                class="calc-btn calc-btn-operation"
            >
              ×
            </B24Button>

            <!-- Цифры 4-6 -->
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('4')"
                class="calc-btn calc-btn-number"
            >
              4
            </B24Button>
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('5')"
                class="calc-btn calc-btn-number"
            >
              5
            </B24Button>
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('6')"
                class="calc-btn calc-btn-number"
            >
              6
            </B24Button>
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('-')"
                class="calc-btn calc-btn-operation"
            >
              −
            </B24Button>

            <!-- Цифры 1-3 -->
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('1')"
                class="calc-btn calc-btn-number"
            >
              1
            </B24Button>
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('2')"
                class="calc-btn calc-btn-number"
            >
              2
            </B24Button>
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('3')"
                class="calc-btn calc-btn-number"
            >
              3
            </B24Button>
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('+')"
                class="calc-btn calc-btn-operation"
            >
              +
            </B24Button>

            <!-- Нижний ряд -->
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('0')"
                class="calc-btn calc-btn-number col-span-2"
            >
              0
            </B24Button>
            <B24Button
                size="lg"
                variant="ghost"
                @click="addToExpression('.')"
                class="calc-btn calc-btn-number"
            >
              .
            </B24Button>
            <B24Button
                size="lg"
                @click="calculate"
                class="calc-btn calc-btn-equals"
            >
              =
            </B24Button>
          </div>

          <!-- Дополнительные кнопки -->
          <div class="grid grid-cols-4 gap-2 mt-2">
            <B24Button
                size="sm"
                variant="ghost"
                @click="addParenthesis('(')"
                class="calc-btn"
            >
              (
            </B24Button>
            <B24Button
                size="sm"
                variant="ghost"
                @click="addParenthesis(')')"
                class="calc-btn"
            >
              )
            </B24Button>
            <B24Button
                size="sm"
                variant="ghost"
                @click="addToExpression('^')"
                class="calc-btn"
            >
              ^
            </B24Button>
            <B24Button
                size="sm"
                variant="ghost"
                @click="addConstant('pi')"
                class="calc-btn"
            >
              π
            </B24Button>
          </div>
        </div>
      </B24Card>

      <!-- Аккордеон для инженерных функций -->
      <B24Card class="overflow-hidden">
        <div
            class="cursor-pointer flex items-center justify-between hover:bg-b24-surface-hover transition-colors p-3"
            @click="toggleEngineering"
        >
          <h3 class="text-sm font-semibold text-b24-text-primary">Инженерные функции</h3>
          <div class="transform transition-transform" :class="{ 'rotate-180': engineeringOpen }">
            <i class="fas fa-calculator text-b24-text-secondary"></i>
          </div>
        </div>

        <!-- Инженерные функции (скрываемое содержимое) -->
        <div v-if="engineeringOpen" class="pt-3 pb-3 px-3">
          <!-- Тригонометрия -->
          <div class="mb-4">
            <h4 class="text-xs font-semibold text-b24-text-secondary mb-2 px-1">Тригонометрия</h4>
            <div class="grid grid-cols-3 gap-2 mb-3">
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('sin')"
                  class="calc-btn-engineering"
              >
                sin
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('cos')"
                  class="calc-btn-engineering"
              >
                cos
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('tan')"
                  class="calc-btn-engineering"
              >
                tan
              </B24Button>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('asin')"
                  class="calc-btn-engineering"
              >
                asin
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('acos')"
                  class="calc-btn-engineering"
              >
                acos
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('atan')"
                  class="calc-btn-engineering"
              >
                atan
              </B24Button>
            </div>
          </div>

          <!-- Математические функции -->
          <div class="mb-4">
            <h4 class="text-xs font-semibold text-b24-text-secondary mb-2 px-1">Математика</h4>
            <div class="grid grid-cols-3 gap-2">
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('sqrt')"
                  class="calc-btn-engineering"
              >
                √
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="addPower(2)"
                  class="calc-btn-engineering"
              >
                x²
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="addPower('y')"
                  class="calc-btn-engineering"
              >
                xʸ
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('ln')"
                  class="calc-btn-engineering"
              >
                ln
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('log10')"
                  class="calc-btn-engineering"
              >
                log₁₀
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('exp')"
                  class="calc-btn-engineering"
              >
                eˣ
              </B24Button>
            </div>
          </div>

          <!-- Константы и факториал -->
          <div class="mb-4">
            <h4 class="text-xs font-semibold text-b24-text-secondary mb-2 px-1">Константы</h4>
            <div class="grid grid-cols-3 gap-2">
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="addConstant('pi')"
                  class="calc-btn-engineering"
              >
                π
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="addConstant('e')"
                  class="calc-btn-engineering"
              >
                e
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('factorial')"
                  class="calc-btn-engineering"
              >
                n!
              </B24Button>
            </div>
          </div>

          <!-- Дополнительные функции -->
          <div>
            <h4 class="text-xs font-semibold text-b24-text-secondary mb-2 px-1">Дополнительно</h4>
            <div class="grid grid-cols-3 gap-2">
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="wrapWithFunction('abs')"
                  class="calc-btn-engineering"
              >
                |x|
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="addReciprocal"
                  class="calc-btn-engineering"
              >
                1/x
              </B24Button>
              <B24Button
                  size="sm"
                  variant="ghost"
                  @click="toggleAngleMode"
                  class="calc-btn-engineering"
              >
                {{ angleMode === 'deg' ? 'DEG' : 'RAD' }}
              </B24Button>
            </div>
          </div>
        </div>
      </B24Card>

      <!-- Аккордеон для истории -->
      <B24Card class="overflow-hidden">
        <div
            class="cursor-pointer flex items-center justify-between hover:bg-b24-surface-hover transition-colors p-3"
            @click="toggleHistory"
        >
          <h3 class="text-sm font-semibold text-b24-text-primary">История расчетов</h3>
          <div class="flex items-center space-x-2">
            <span v-if="history.length > 0" class="text-xs text-b24-text-secondary">
              {{ history.length }}
            </span>
            <div class="transform transition-transform" :class="{ 'rotate-180': historyOpen }">
              <i class="fas fa-chevron-down text-b24-text-secondary"></i>
            </div>
          </div>
        </div>

        <!-- История (скрываемое содержимое) -->
        <div v-if="historyOpen" class="pt-3 pb-3 px-3">
          <div v-if="history.length === 0" class="text-center py-4">
            <p class="text-sm text-b24-text-secondary">История расчетов пуста</p>
          </div>

          <div v-else class="space-y-2 max-h-40 overflow-y-auto">
            <div
                v-for="item in history.slice(0, 5)"
                :key="item.id"
                @click="restoreFromHistory(item)"
                class="history-item p-2 rounded cursor-pointer hover:bg-b24-surface-hover transition-colors"
            >
              <div class="flex justify-between items-start">
                <div class="text-sm text-b24-text-secondary font-mono truncate">
                  {{ item.expression }}
                </div>
                <span class="text-xs text-b24-text-tertiary ml-2 flex-shrink-0">
                  {{ item.timestamp }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-start mt-3">
            <B24Button
                size="xs"
                variant="ghost"
                @click="clearHistory"
                class="text-xs w-full justify-center"
            >
              Очистить
            </B24Button>
          </div>
        </div>
      </B24Card>
    </div>

    <!-- Модальное окно справки -->
    <B24Modal
        v-if="showHelpModal"
        :show="showHelpModal"
        title="Справка по калькулятору"
        @close="showHelpModal = false"
        size="md"
    >
      <div class="p-4">
        <div class="space-y-4">
          <!-- Основные клавиши -->
          <div>
            <h3 class="text-sm font-semibold text-b24-text-primary mb-2">Основные клавиши</h3>
            <div class="space-y-1 text-sm text-b24-text-secondary">
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">Enter</span>
                <span>= Вычислить результат</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">=</span>
                <span>= Вычислить результат</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">Esc</span>
                <span>= Очистить всё (C)</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">Delete</span>
                <span>= Очистить всё (C)</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">Backspace</span>
                <span>= Удалить последний символ (⌫)</span>
              </div>
            </div>
          </div>

          <!-- Математические операции -->
          <div>
            <h3 class="text-sm font-semibold text-b24-text-primary mb-2">Математические операции</h3>
            <div class="space-y-1 text-sm text-b24-text-secondary">
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">+</span>
                <span>= Сложение</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">-</span>
                <span>= Вычитание</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">*</span>
                <span>= Умножение</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">/</span>
                <span>= Деление</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">^</span>
                <span>= Возведение в степень</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">%</span>
                <span>= Процент</span>
              </div>
            </div>
          </div>

          <!-- Скобки и константы -->
          <div>
            <h3 class="text-sm font-semibold text-b24-text-primary mb-2">Скобки и константы</h3>
            <div class="space-y-1 text-sm text-b24-text-secondary">
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">( )</span>
                <span>= Открыть/закрыть скобки</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">Ctrl + P</span>
                <span>= Вставить число π (пи)</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">Ctrl + E</span>
                <span>= Вставить число e</span>
              </div>
            </div>
          </div>

          <!-- Цифры и десятичная точка -->
          <div>
            <h3 class="text-sm font-semibold text-b24-text-primary mb-2">Цифры и десятичная точка</h3>
            <div class="grid grid-cols-3 gap-1">
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">0-9</span>
                <span>= Цифры</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">.</span>
                <span>= Десятичная точка</span>
              </div>
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">,</span>
                <span>= Десятичная точка (альтернативная)</span>
              </div>
            </div>
          </div>

          <!-- Быстрые действия -->
          <div>
            <h3 class="text-sm font-semibold text-b24-text-primary mb-2">Быстрые действия</h3>
            <div class="space-y-1 text-sm text-b24-text-secondary">
              <div class="flex items-center">
                <span class="inline-block bg-b24-surface-hover px-2 py-1 rounded text-xs font-mono mr-2">%</span>
                <span>= Добавить процент к выражению</span>
              </div>
              <div class="text-xs text-b24-text-tertiary mt-1">
                Пример: 10% → 0.1, 10%100 → 10
              </div>
            </div>
          </div>

          <!-- Примечания -->
          <div class="pt-2 border-t border-b24-border">
            <h3 class="text-sm font-semibold text-b24-text-primary mb-2">Примечания</h3>
            <ul class="text-xs text-b24-text-secondary space-y-1 list-disc pl-4">
              <li>Все вычисления происходят в реальном времени</li>
              <li>Результат автоматически форматируется для удобства чтения</li>
              <li>Вы можете использовать как цифровую клавиатуру, так и кнопки на экране</li>
              <li>История сохраняется локально в браузере</li>
              <li>Для закрытия модального окна нажмите Esc или кликните вне окна</li>
            </ul>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <B24Button
              size="sm"
              variant="primary"
              @click="showHelpModal = false"
          >
            Закрыть
          </B24Button>
        </div>
      </template>
    </B24Modal>
  </B24App>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'

const bitrixData = window.bitrixData || {}
const dialogId = ref(bitrixData.dialogId)
const toast = useToast()

// Реактивные данные
const currentExpression = ref('')
const result = ref('')
const history = ref([])
const previousExpression = ref('')
const engineeringOpen = ref(false)
const keyboardOpen = ref(false)
const historyOpen = ref(false)
const angleMode = ref('deg')
const lastResult = ref(null)
const inputRef = ref(null)

// Новый параметр для управления видимостью кнопки "Отправить"
const sendBtnActive = ref(true) // По умолчанию true - кнопка отображается

// Для модального окна справки
const showHelpModal = ref(false)
const helpTooltip = ref(false)

// Флаг для предотвращения двойного сохранения
const lastSavedExpression = ref(null)
const lastSavedResult = ref(null)

// Константы
const MATH_CONSTANTS = {
  pi: '3.141592653589793',
  e: '2.718281828459045'
}

// Специальные математические функции
const MATH_FUNCTIONS = {
  sin: (x, deg) => deg ? Math.sin(x * Math.PI / 180) : Math.sin(x),
  cos: (x, deg) => deg ? Math.cos(x * Math.PI / 180) : Math.cos(x),
  tan: (x, deg) => deg ? Math.tan(x * Math.PI / 180) : Math.tan(x),
  asin: (x, deg) => deg ? Math.asin(x) * 180 / Math.PI : Math.asin(x),
  acos: (x, deg) => deg ? Math.acos(x) * 180 / Math.PI : Math.acos(x),
  atan: (x, deg) => deg ? Math.atan(x) * 180 / Math.PI : Math.atan(x),
  sqrt: (x) => Math.sqrt(x),
  ln: (x) => Math.log(x),
  log10: (x) => Math.log10(x),
  exp: (x) => Math.exp(x),
  abs: (x) => Math.abs(x),
  factorial: (x) => {
    if (x < 0 || x > 170) throw new Error('Факториал определен для 0 ≤ n ≤ 170')
    let result = 1
    for (let i = 2; i <= Math.floor(x); i++) {
      result *= i
    }
    return result
  }
}

// Вычисляемые свойства
const inputPlaceholder = computed(() => {
  return currentExpression.value ? '' : 'Введите выражение...'
})

const displayExpression = computed(() => {
  // Заменяем символы для отображения
  let expr = currentExpression.value
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/\-/g, '−')
      .replace(/pi/g, 'π')
      .replace(/e/g, 'e')
      .replace(/sqrt/g, '√')

  return expr || ''
})

const formattedResult = computed(() => {
  if (!result.value || result.value === '...') {
    return result.value || '0'
  }

  if (result.value === 'Ошибка' || result.value === 'Деление на ноль') {
    return result.value
  }

  try {
    const num = parseFloat(result.value)
    if (isNaN(num)) return result.value

    // Проверка на бесконечность
    if (!isFinite(num)) {
      return num > 0 ? '∞' : '-∞'
    }

    // Округляем очень маленькие числа
    if (Math.abs(num) < 1e-12) return '0'

    // Форматируем число
    if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6)
    }

    // Форматируем с разделителями тысяч
    const parts = num.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

    if (parts[1]) {
      // Обрезаем лишние нули в дробной части
      parts[1] = parts[1].replace(/0+$/, '')
      if (parts[1] === '') {
        return parts[0]
      }
      return parts.join(',')
    }

    return parts[0]
  } catch {
    return result.value
  }
})

// Утилиты для уведомлений
const notification = {
  success: (message) => {
    toast.add({
      description: message,
      variant: 'success'
    })
  },
  error: (message) => {
    toast.add({
      description: message,
      variant: 'error'
    })
  },
  info: (message) => {
    toast.add({
      description: message,
      variant: 'info'
    })
  }
}

// Утилиты для Bitrix24
const bitrixUtils = {
  fitWindow: () => {
    if (typeof BX24 !== 'undefined' && typeof BX24.fitWindow === 'function') {
      try {
        BX24.fitWindow()
      } catch (error) {
        console.error('Ошибка при вызове BX24.fitWindow:', error)
      }
    }
  },

  sendMessage: async (message) => {
    try {
      const currentDialogId = dialogId.value || BX24?.user?.id

      if (!currentDialogId) {
        throw new Error('Не удалось определить чат для отправки')
      }

      const result = await BX24.callMethod('im.message.add', {
        DIALOG_ID: currentDialogId,
        MESSAGE: message,
        SYSTEM: 'N'
      })

      if (result.error()) {
        throw new Error(result.error().getError())
      }

      return true
    } catch (error) {
      throw error
    }
  },

  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      throw new Error('Не удалось скопировать текст')
    }
  }
}

// Основные операции калькулятора
const calculator = {
  evaluateExpression: () => {
    try {
      if (!currentExpression.value || currentExpression.value.trim() === '') {
        result.value = ''
        return
      }

      const expr = currentExpression.value

      // Если выражение заканчивается на оператор, не вычисляем
      if (/[\+\-\*\/\^%]$/.test(expr)) {
        result.value = '...'
        return
      }

      try {
        const parsedExpr = calculator.parseExpression(expr)
        const evaluated = Function('"use strict"; return (' + parsedExpr + ')')()

        // Проверка на деление на ноль
        if (!isFinite(evaluated)) {
          // Проверяем, было ли деление на ноль
          if (expr.includes('/0') || expr.includes('/ 0')) {
            result.value = 'Деление на ноль'
          } else {
            result.value = evaluated > 0 ? '∞' : '-∞'
          }
        } else if (isNaN(evaluated)) {
          result.value = '...'
        } else {
          // Округляем для устранения ошибок округления
          const rounded = Math.round(evaluated * 1e12) / 1e12
          result.value = rounded.toString()
        }
      } catch (error) {
        console.log('Выражение пока не может быть вычислено:', error.message)
        result.value = '...'
      }
    } catch (error) {
      console.error('Ошибка вычисления:', error)
      result.value = 'Ошибка'
    }
  },

  // Парсер математических выражений
  parseExpression: (expr) => {
    try {
      // Заменяем символы для вычисления
      expr = expr
          .replace(/÷/g, '/')
          .replace(/×/g, '*')
          .replace(/−/g, '-')
          .replace(/π/g, MATH_CONSTANTS.pi)
          .replace(/e/g, MATH_CONSTANTS.e)
          .replace(/\^/g, '**')

      // Обработка процентов - ИСПРАВЛЕННАЯ ЛОГИКА
      // Ищем паттерн: число%число
      const percentRegex = /(\d+(?:\.\d+)?)%(\d+(?:\.\d+)?)/g
      expr = expr.replace(percentRegex, (match, percent, number) => {
        const percentValue = parseFloat(percent)
        const numberValue = parseFloat(number)
        return `(${percentValue}/100*${numberValue})`
      })

      // Обработка одиночных процентов в конце выражения
      // Например: 10% становится 0.1
      if (expr.includes('%') && !expr.includes('%', expr.indexOf('%') + 1)) {
        const lastPercentRegex = /(\d+(?:\.\d+)?)%$/
        if (lastPercentRegex.test(expr)) {
          expr = expr.replace(lastPercentRegex, (match, number) => {
            return `(${number}/100)`
          })
        }
      }

      // Обработка функций
      const functionRegex = /(sin|cos|tan|asin|acos|atan|sqrt|ln|log10|exp|abs|factorial)\(([^)]+)\)/g
      expr = expr.replace(functionRegex, (match, func, arg) => {
        try {
          // Вычисляем аргумент
          const argValue = Function('"use strict"; return (' + arg + ')')()
          const isDeg = angleMode.value === 'deg' && ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'].includes(func)
          const result = MATH_FUNCTIONS[func](argValue, isDeg)

          // Для бесконечности возвращаем Infinity
          if (!isFinite(result)) {
            return result > 0 ? 'Infinity' : '-Infinity'
          }

          return result.toString()
        } catch (error) {
          console.error('Ошибка вычисления функции:', func, arg, error)
          throw error
        }
      })

      return expr
    } catch (error) {
      throw error
    }
  },

  calculate: () => {
    try {
      // Вычисляем текущее выражение
      calculator.evaluateExpression()

      // Если результат успешно вычислен и он валидный
      if (result.value && result.value !== '...' &&
          result.value !== 'Ошибка' && result.value !== 'Деление на ноль' &&
          currentExpression.value) {

        // Форматируем выражение для отображения
        const displayExpr = displayExpression.value
        const resultValue = formattedResult.value

        if (resultValue && resultValue !== '...' && resultValue !== '') {
          // Проверяем, не сохраняли ли мы уже это выражение (предотвращение двойного сохранения)
          const currentUniqueKey = `${displayExpr}|${resultValue}`
          if (lastSavedExpression.value !== currentUniqueKey) {
            // Сохраняем в историю ВМЕСТЕ с результатом
            historyManager.add(`${displayExpr} = ${resultValue}`)

            // Запоминаем, что сохранили это выражение
            lastSavedExpression.value = currentUniqueKey
            lastSavedResult.value = result.value

            // В верхней строке показываем только выражение с результатом
            previousExpression.value = `${displayExpr} = ${resultValue}`

            // Сохраняем результат для возможного использования
            lastResult.value = result.value
          }
        }
      }
    } catch (error) {
      result.value = 'Ошибка'
      notification.error('Ошибка вычисления')
    }
  },

  clear: () => {
    currentExpression.value = ''
    result.value = ''
    previousExpression.value = ''
    lastResult.value = null
    lastSavedExpression.value = null
    lastSavedResult.value = null
    focusInput()
  },

  backspace: () => {
    if (currentExpression.value.length > 0) {
      currentExpression.value = currentExpression.value.slice(0, -1)
      calculator.evaluateExpression()
    }
    focusInput()
  },

  addPercentage: () => {
    // Просто добавляем символ процента
    currentExpression.value += '%'
    calculator.evaluateExpression()
    focusInput()
  }
}

// Управление состоянием приложения
const appState = {
  toggle: (property) => {
    property.value = !property.value
  },

  toggleKeyboard: () => appState.toggle(keyboardOpen),
  toggleEngineering: () => appState.toggle(engineeringOpen),
  toggleHistory: () => appState.toggle(historyOpen),

  toggleAngleMode: () => {
    angleMode.value = angleMode.value === 'deg' ? 'rad' : 'deg'
    notification.success(`Режим углов: ${angleMode.value === 'deg' ? 'Градусы' : 'Радианы'}`)
    // Пересчитываем выражение при смене режима
    if (currentExpression.value) {
      calculator.evaluateExpression()
    }
  },

  focusInput: () => {
    if (inputRef.value) {
      inputRef.value.focus()
      // Устанавливаем курсор в конец
      setTimeout(() => {
        if (inputRef.value) {
          inputRef.value.selectionStart = inputRef.value.selectionEnd = currentExpression.value.length
        }
      }, 10)
    }
  }
}

// Добавление символов в выражение
const expressionManager = {
  debounceTimer: null,

  addToExpression: (value) => {
    currentExpression.value += value
    calculator.evaluateExpression()
    focusInput()
  },

  addParenthesis: (parenthesis) => {
    const lastChar = currentExpression.value.slice(-1)

    if (parenthesis === '(' && /[\d\)]/.test(lastChar)) {
      currentExpression.value += '*('
    } else {
      currentExpression.value += parenthesis
    }

    calculator.evaluateExpression()
    focusInput()
  },

  wrapWithFunction: (funcName) => {
    const expr = currentExpression.value

    if (!expr) {
      // Если выражение пустое, просто добавляем функцию
      currentExpression.value = funcName + '('
    } else {
      // Получаем последнее число или выражение
      const lastNumberRegex = /(-?\d*\.?\d+|\))(?![\d\.\)])/
      const matches = expr.match(lastNumberRegex)

      if (matches && matches[1]) {
        const lastNumber = matches[1]
        const lastNumberIndex = expr.lastIndexOf(lastNumber)

        if (lastNumberIndex !== -1) {
          // Заменяем последнее число на func(lastNumber)
          const before = expr.substring(0, lastNumberIndex)
          const after = expr.substring(lastNumberIndex + lastNumber.length)
          currentExpression.value = before + funcName + '(' + lastNumber + ')' + after
        }
      } else {
        // Если не нашли число, просто оборачиваем всё выражение
        currentExpression.value = funcName + '(' + expr + ')'
      }
    }

    calculator.evaluateExpression()
    focusInput()
  },

  addFunction: (funcName) => {
    currentExpression.value += funcName + '('
    calculator.evaluateExpression()
    focusInput()
  },

  addPower: (power) => {
    if (power === 'y') {
      currentExpression.value += '^'
    } else {
      const expr = currentExpression.value
      if (expr) {
        // Получаем последнее число
        const lastNumberRegex = /(-?\d*\.?\d+)(?![\d\.])/
        const matches = expr.match(lastNumberRegex)

        if (matches && matches[1]) {
          const lastNumber = matches[1]
          const lastNumberIndex = expr.lastIndexOf(lastNumber)

          if (lastNumberIndex !== -1) {
            // Заменяем последнее число на lastNumber^power
            const before = expr.substring(0, lastNumberIndex)
            const after = expr.substring(lastNumberIndex + lastNumber.length)
            currentExpression.value = before + '(' + lastNumber + '^' + power + ')' + after
          }
        } else {
          currentExpression.value += '^' + power
        }
      } else {
        currentExpression.value += '^' + power
      }
    }
    calculator.evaluateExpression()
    focusInput()
  },

  addConstant: (constant) => {
    const lastChar = currentExpression.value.slice(-1)
    const value = constant === 'pi' ? 'pi' : 'e'

    if (/[\d\)]/.test(lastChar)) {
      currentExpression.value += '*' + value
    } else {
      currentExpression.value += value
    }

    calculator.evaluateExpression()
    focusInput()
  },

  addReciprocal: () => {
    const expr = currentExpression.value
    if (expr) {
      currentExpression.value = '1/(' + expr + ')'
    } else {
      currentExpression.value = '1/'
    }
    calculator.evaluateExpression()
    focusInput()
  }
}

// Управление историей
const historyManager = {
  add: (expression) => {
    history.value.unshift({
      id: Date.now(),
      expression,
      timestamp: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}),
      rawExpression: currentExpression.value // Сохраняем исходное выражение
    })

    history.value = history.value.slice(0, 20)
    historyManager.save()
  },

  clear: () => {
    history.value = []
    historyManager.save()
    lastSavedExpression.value = null
    lastSavedResult.value = null
    notification.success('История очищена')
  },

  restore: (item) => {
    // Восстанавливаем исходное выражение
    if (item.rawExpression) {
      currentExpression.value = item.rawExpression
    } else {
      // Если нет rawExpression, пытаемся извлечь из отформатированного
      const parts = item.expression.split(' = ')
      if (parts.length === 2) {
        const expr = parts[0]
        // Конвертируем символы обратно
        currentExpression.value = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, 'pi')
            .replace(/√/g, 'sqrt')
            .replace(/\^/g, '^')
      }
    }

    // Вычисляем результат
    calculator.evaluateExpression()
    previousExpression.value = item.expression

    // Сбрасываем флаг последнего сохранения чтобы можно было повторно сохранить
    lastSavedExpression.value = null
    lastSavedResult.value = null

    focusInput()
    notification.success('Выражение восстановлено')
  },

  save: () => {
    try {
      localStorage.setItem('calculator_history', JSON.stringify(history.value))
    } catch (error) {
      console.error('Ошибка сохранения истории:', error)
    }
  },

  load: () => {
    try {
      const saved = localStorage.getItem('calculator_history')
      if (saved) {
        history.value = JSON.parse(saved) || []
      }
    } catch (error) {
      console.error('Ошибка загрузки истории:', error)
    }
  }
}

// Утилиты для взаимодействия
const interaction = {
  copyToClipboard: async () => {
    try {
      const textToCopy = formattedResult.value !== '...' && formattedResult.value !== ''
          ? formattedResult.value
          : '0'
      await bitrixUtils.copyToClipboard(textToCopy)
      notification.success('Результат скопирован в буфер обмена')
    } catch (error) {
      console.error('Ошибка копирования:', error)
      notification.error(error.message || 'Ошибка копирования')
    }
  },

  sendToChat: async () => {
    try {
      const expression = previousExpression.value ||
          (currentExpression.value && result.value !== '...' && result.value !== '' ?
              `${displayExpression.value} = ${formattedResult.value}` :
              formattedResult.value || '0')

      const message = `Результат расчета: ${expression}`
      await bitrixUtils.sendMessage(message)
      notification.success('Результат отправлен в чат')
    } catch (error) {
      console.error('Ошибка отправки:', error)
      notification.error(error.message || 'Ошибка отправки сообщения')
    }
  }
}

// Обработка клавиатуры - ИСПРАВЛЕННЫЙ КОД
const keyboardHandler = {
  handleKeyDown: (e) => {
    const key = e.key

    // Закрытие модального окна по Esc
    if (showHelpModal.value && key === 'Escape') {
      showHelpModal.value = false
      e.preventDefault()
      return
    }

    // Пропускаем обработку, если input уже обрабатывает ввод
    if (e.target.tagName === 'INPUT') {
      // Для цифр, операторов и символа % позволяем браузеру обработать ввод самому
      if (/^[0-9\.\+\-\*\/\^\(\)%,]$/.test(key)) {
        return // Пусть браузер сам добавит символ через v-model
      }
    }

    // Блокируем стандартное поведение только для специальных клавиш
    if (key === 'Enter' || key === '=' ||
        key === 'Escape' || key === 'Delete' ||
        key === 'Backspace' ||
        (key === 'p' && e.ctrlKey) ||
        (key === 'e' && e.ctrlKey)) {
      e.preventDefault()
    }

    // Обработка специальных клавиш
    if (key === 'Enter' || key === '=') {
      e.preventDefault()
      calculator.calculate()
    } else if (key === 'Escape' || key === 'Delete') {
      e.preventDefault()
      calculator.clear()
    } else if (key === 'Backspace') {
      e.preventDefault()
      calculator.backspace()
    } else if (key === '^') {
      e.preventDefault()
      expressionManager.addPower('y')
    } else if (key === '(') {
      e.preventDefault()
      expressionManager.addParenthesis('(')
    } else if (key === ')') {
      e.preventDefault()
      expressionManager.addParenthesis(')')
    } else if (key === 'p' && e.ctrlKey) {
      e.preventDefault()
      expressionManager.addConstant('pi')
    } else if (key === 'e' && e.ctrlKey) {
      e.preventDefault()
      expressionManager.addConstant('e')
    }
    // УБРАНА обработка клавиши '%' - теперь браузер обрабатывает её сам
  },

  onExpressionChange: () => {
    // Используем debounce для вычисления
    clearTimeout(expressionManager.debounceTimer)
    expressionManager.debounceTimer = setTimeout(() => {
      calculator.evaluateExpression()
    }, 150)
  },

  onInputFocus: () => {
    // При фокусе на input ничего не делаем
  },

  onInputBlur: () => {
    // При потере фокуса ничего не делаем
  }
}

// Инициализация и жизненный цикл
const initialize = () => {
  historyManager.load()

  // Чтение параметров из bitrixData
  if (bitrixData && typeof bitrixData.sendBtnActive !== 'undefined') {
    sendBtnActive.value = Boolean(bitrixData.sendBtnActive)
  }

  if (typeof BX24 !== 'undefined') {
    BX24.init(() => {
      console.log('Bitrix24 SDK инициализирован')
      // Вызываем fitWindow только при инициализации
      bitrixUtils.fitWindow()
    })
  } else {
    console.warn('Битрикс24 SDK не найден')
  }

  document.addEventListener('keydown', keyboardHandler.handleKeyDown)

  // Фокусируемся на input при загрузке
  setTimeout(() => focusInput(), 100)
}

const cleanup = () => {
  document.removeEventListener('keydown', keyboardHandler.handleKeyDown)
  if (expressionManager.debounceTimer) {
    clearTimeout(expressionManager.debounceTimer)
  }
}

// Экспорт методов для использования в шаблоне
const toggleEngineering = appState.toggleEngineering
const toggleKeyboard = appState.toggleKeyboard
const toggleHistory = appState.toggleHistory
const toggleAngleMode = appState.toggleAngleMode
const focusInput = appState.focusInput

const addToExpression = expressionManager.addToExpression
const addParenthesis = expressionManager.addParenthesis
const addFunction = expressionManager.addFunction
const wrapWithFunction = expressionManager.wrapWithFunction
const addPower = expressionManager.addPower
const addConstant = expressionManager.addConstant
const addReciprocal = expressionManager.addReciprocal
const addPercentage = calculator.addPercentage
const calculate = calculator.calculate
const clear = calculator.clear
const backspace = calculator.backspace

// История
const clearHistory = historyManager.clear
const restoreFromHistory = historyManager.restore

// Взаимодействие
const copyToClipboard = interaction.copyToClipboard
const sendToChat = interaction.sendToChat

// Обработчики input
const handleKeyDown = keyboardHandler.handleKeyDown
const onExpressionChange = keyboardHandler.onExpressionChange
const onInputFocus = keyboardHandler.onInputFocus
const onInputBlur = keyboardHandler.onInputBlur

// Хуки жизненного цикла
onMounted(() => {
  initialize()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.calculator-display {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
  word-break: break-all;
  overflow-wrap: break-word;
  min-height: 1.5em;
  user-select: text;
}

/* Стили для input */
.calculator-input {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  font-family: inherit;
  width: 100%;
  text-align: right;
  caret-color: var(--b24-primary-color);
}

.calculator-input::placeholder {
  color: var(--b24-text-secondary);
  opacity: 0.6;
}

.calculator-input:focus {
  outline: none;
  box-shadow: none;
}

.operation-active {
  background-color: rgba(47, 198, 246, 0.15) !important;
  border-color: var(--b24-primary-color) !important;
  color: var(--b24-primary-color) !important;
}

.history-item {
  transition: background-color 0.2s ease;
}

/* Стили для кнопок */
.calc-btn {
  transition: all 0.1s ease;
  user-select: none;
  min-height: 44px;
}

.calc-btn:active {
  transform: scale(0.95);
}

.calc-btn-number {
  background-color: var(--b24-surface-color);
}

.calc-btn-operation {
  background-color: rgba(47, 198, 246, 0.1);
  color: var(--b24-primary-color);
}

.calc-btn-operation:hover {
  background-color: rgba(47, 198, 246, 0.2) !important;
}

.calc-btn-equals {
  background-color: var(--b24-primary-color);
  color: white;
}

.calc-btn-equals:hover {
  background-color: #1eb4e0 !important;
}

/* Стили для инженерных кнопок */
.calc-btn-engineering {
  background-color: var(--b24-surface-color);
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  min-height: 36px;
}

.calc-btn-engineering:hover {
  background-color: rgba(47, 198, 246, 0.1) !important;
}

/* Анимация для аккордеона */
.rotate-180 {
  transform: rotate(180deg);
}

/* Компактные отступы для карточек */
:deep(.b24-card-body) {
  padding: 0 !important;
}

/* Стили для аккордеона инженерных функций */
.engineering-section {
  border-bottom: 1px solid var(--b24-border-color);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}

.engineering-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.engineering-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--b24-text-secondary);
  margin-bottom: 0.5rem;
  padding-left: 0.25rem;
}

/* Подсветка фокуса */
.calculator-input:focus {
  outline: 2px solid var(--b24-primary-color);
  outline-offset: -2px;
  border-radius: 4px;
}

/* Стили для кнопки справки */
.help-button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: bold;
  background-color: rgba(47, 198, 246, 0.1);
  color: var(--b24-primary-color);
}

.help-button:hover {
  background-color: rgba(47, 198, 246, 0.2);
  transform: scale(1.1);
}
</style>