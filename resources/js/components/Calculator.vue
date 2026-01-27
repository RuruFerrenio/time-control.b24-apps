<template>
  <div class="poll-form-wrapper">
    <div class="poll-form-container">
      <div class="poll-card">
        <div class="poll-card-header">
          <h1 class="poll-title">Создание опроса</h1>
        </div>

        <div class="poll-card-content">
          <form ref="pollForm" @submit.prevent="handleSubmit" class="poll-form">
            <!-- Вопрос -->
            <div class="form-group">
              <label class="form-label required">Вопрос</label>
              <textarea
                  v-model="formData.subject"
                  placeholder="Введите ваш вопрос"
                  rows="3"
                  required
                  class="question-input"
              />
            </div>

            <!-- Переключение режима -->
            <div class="form-group">
              <label class="form-label">Режим опроса</label>
              <div class="mode-switcher-container">
                <div class="mode-switcher">
                  <button
                      type="button"
                      :class="['mode-btn', { 'active': formData.mode === 'vote' }]"
                      @click="formData.mode = 'vote'"
                      class="mode-btn"
                  >
                    <span class="mode-icon">👥</span>
                    Голосование
                  </button>
                  <button
                      type="button"
                      :class="['mode-btn', { 'active': formData.mode === 'approval' }]"
                      @click="formData.mode = 'approval'"
                      class="mode-btn"
                  >
                    <span class="mode-icon">✓</span>
                    Согласование
                  </button>
                </div>
                <div class="mode-description">
                  <span v-if="formData.mode === 'vote'">
                    Участники выбирают один или несколько вариантов ответа
                  </span>
                  <span v-else>
                    Участники могут согласовать или отклонить (если разрешено)
                  </span>
                </div>
              </div>
            </div>

            <!-- Выбор участников -->
            <div class="participants-section">
              <h3 class="section-title">Участники опроса</h3>
              <div class="section-description">
                Выберите пользователей, которые примут участие в опросе
              </div>

              <div class="participants-selector">
                <!-- Кнопка открытия диалога выбора пользователей -->
                <button
                    type="button"
                    @click="openUserSelector"
                    class="select-users-btn"
                >
                  <span class="selector-icon">👤</span>
                  {{ selectedUsers.length > 0 ? `Выбрано: ${selectedUsers.length}` : 'Выбрать участников' }}
                </button>

                <!-- Отображение выбранных пользователей -->
                <div v-if="selectedUsers.length > 0" class="selected-users-list">
                  <div
                      v-for="user in selectedUsers"
                      :key="user.id"
                      class="selected-user-item"
                  >
                    <div class="user-avatar">
                      {{ getUserInitials(user.name) }}
                    </div>
                    <div class="user-info">
                      <div class="user-name">{{ user.name }}</div>
                      <div class="user-id">ID: {{ user.id }}</div>
                    </div>
                    <button
                        type="button"
                        @click="removeUser(user.id)"
                        class="remove-user-btn"
                        title="Удалить из списка"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <!-- Кнопка очистки выбора -->
                <button
                    v-if="selectedUsers.length > 0"
                    type="button"
                    @click="clearAllUsers"
                    class="clear-users-btn"
                >
                  🗑️ Очистить всех
                </button>
              </div>

              <!-- Информация о выборе -->
              <div v-if="selectedUsers.length > 0" class="selection-info">
                <div class="info-icon">ℹ️</div>
                <div class="info-text">
                  Выбрано <strong>{{ selectedUsers.length }}</strong> участник{{ selectedUsers.length === 1 ? '' : 'ов' }}.
                  <span v-if="selectedUsers.length === 1">Вы можете выбрать больше участников.</span>
                  <span v-else>Нажмите "Выбрать участников" для добавления.</span>
                </div>
              </div>
            </div>

            <!-- Варианты ответов -->
            <div class="options-section">
              <h3 class="section-title">Варианты ответов</h3>
              <div class="section-description">
                <span v-if="formData.mode === 'vote'">
                  Добавьте варианты ответов для голосования (минимум 2)
                </span>
                <span v-else>
                  В режиме согласования используется фиксированный вариант
                </span>
              </div>

              <div class="options-list">
                <div
                    v-for="(option, index) in formData.options"
                    :key="index"
                    class="option-item"
                >
                  <div class="option-field-wrapper">
                    <div class="option-form-group">
                      <div class="option-label">
                        <span>Вариант {{ index + 1 }}</span>
                        <span v-if="formData.mode === 'approval'" class="option-type">
                          {{ index === 0 ? '(Согласовать)' : '(Отклонить)' }}
                        </span>
                      </div>
                      <input
                          v-model="formData.options[index]"
                          :placeholder="formData.mode === 'approval'
                          ? (index === 0 ? 'Согласовать' : 'Отклонить')
                          : `Введите вариант ответа ${index + 1}`"
                          :disabled="formData.mode === 'approval'"
                          required
                          class="option-input"
                      />
                    </div>

                    <button
                        v-if="formData.options.length > minOptions && formData.mode === 'vote'"
                        type="button"
                        @click="removeOption(index)"
                        class="remove-btn"
                        :title="`Удалить вариант ${index + 1}`"
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                </div>
              </div>

              <button
                  v-if="formData.mode === 'vote'"
                  type="button"
                  @click="addOption"
                  class="add-option-btn"
              >
                ➕ Добавить вариант
              </button>
            </div>

            <!-- Настройки опроса -->
            <div class="settings-section">
              <div class="settings-accordion">
                <div class="accordion-header" @click="showSettings = !showSettings">
                  <span class="accordion-icon">⚙️</span>
                  <h3 class="accordion-title">Настройки опроса</h3>
                  <span class="accordion-arrow">{{ showSettings ? '▲' : '▼' }}</span>
                </div>

                <div v-if="showSettings" class="settings-content">
                  <!-- Анонимное голосование -->
                  <div class="setting-item">
                    <div class="setting-label-wrapper">
                      <div class="setting-label">Анонимное голосование</div>
                      <div class="setting-description">
                        Голоса участников не будут видны другим пользователям
                      </div>
                    </div>
                    <label class="switch">
                      <input
                          type="checkbox"
                          v-model="formData.security"
                          :checked="formData.security"
                          :disabled="formData.mode === 'approval'"
                      >
                      <span class="switch-slider"></span>
                    </label>
                  </div>

                  <!-- Показывать кол-во голосов -->
                  <div class="setting-item">
                    <div class="setting-label-wrapper">
                      <div class="setting-label">Показывать количество голосов</div>
                      <div class="setting-description">
                        Участники смогут видеть статистику по каждому варианту
                      </div>
                    </div>
                    <label class="switch">
                      <input
                          type="checkbox"
                          v-model="formData.showVotes"
                          :checked="formData.showVotes"
                      >
                      <span class="switch-slider"></span>
                    </label>
                  </div>

                  <!-- Оповещать о результате -->
                  <div class="setting-item">
                    <div class="setting-label-wrapper">
                      <div class="setting-label">Оповестить участников о результате</div>
                      <div class="setting-description">
                        Все участники получат уведомление при завершении опроса
                      </div>
                    </div>
                    <label class="switch">
                      <input
                          type="checkbox"
                          v-model="formData.notifyOnComplete"
                          :checked="formData.notifyOnComplete"
                      >
                      <span class="switch-slider"></span>
                    </label>
                  </div>

                  <!-- Разрешить отклонение (только для режима согласования) -->
                  <div v-if="formData.mode === 'approval'" class="setting-item">
                    <div class="setting-label-wrapper">
                      <div class="setting-label">Разрешить отклонение</div>
                      <div class="setting-description">
                        Добавить вариант "Отклонить" для участников согласования
                      </div>
                    </div>
                    <label class="switch">
                      <input
                          type="checkbox"
                          v-model="formData.allowRejection"
                          :checked="formData.allowRejection"
                      >
                      <span class="switch-slider"></span>
                    </label>
                  </div>

                  <!-- Множественный выбор (только для голосования) -->
                  <div v-if="formData.mode === 'vote'" class="setting-item">
                    <div class="setting-label-wrapper">
                      <div class="setting-label">Множественный выбор</div>
                      <div class="setting-description">
                        Участники смогут выбирать несколько вариантов ответа
                      </div>
                    </div>
                    <label class="switch">
                      <input
                          type="checkbox"
                          v-model="formData.multipleChoice"
                          :checked="formData.multipleChoice"
                      >
                      <span class="switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Сообщение -->
            <div v-if="generatedMessage" :class="['message-alert', messageType]">
              <div class="alert-title">{{ messageType === 'success' ? 'Успешно!' : 'Ошибка!' }}</div>
              <div class="alert-message">{{ generatedMessage }}</div>
              <button @click="generatedMessage = ''" class="alert-close">×</button>
            </div>

            <!-- Кнопка отправки -->
            <div class="submit-section">
              <button
                  type="submit"
                  :disabled="isSubmitting || selectedUsers.length === 0"
                  class="submit-btn"
              >
                <span v-if="isSubmitting" class="spinner">⏳</span>
                <span v-else>✓</span>
                {{ isSubmitting ? 'Создание опроса...' : 'Создать опрос' }}
                <span v-if="selectedUsers.length > 0" class="participants-count">
                  ({{ selectedUsers.length }} участник{{ selectedUsers.length === 1 ? '' : 'ов' }})
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useToast } from '@bitrix24/b24ui-nuxt/composables/useToast'

export default {
  name: 'PollForm',
  setup() {
    // Состояние формы
    const formData = reactive({
      subject: '',
      mode: 'vote', // 'vote' или 'approval'
      security: true,
      showVotes: true,
      notifyOnComplete: false,
      allowRejection: false,
      multipleChoice: false,
      options: ['', '']
    })

    const pollForm = ref(null)
    const generatedMessage = ref('')
    const messageType = ref('success')
    const isSubmitting = ref(false)
    const showSettings = ref(true)

    // Состояние для выбора пользователей
    const selectedUsers = ref([])

    // Уведомления через Bitrix24
    const toast = useToast()

    // Минимальное количество вариантов в зависимости от режима
    const minOptions = computed(() => {
      return formData.mode === 'approval'
          ? (formData.allowRejection ? 2 : 1)
          : 2
    })

    // Следим за изменением режима
    watch(() => formData.mode, (newMode) => {
      if (newMode === 'approval') {
        // Устанавливаем варианты для согласования
        formData.options = ['Согласовать']
        if (formData.allowRejection) {
          formData.options.push('Отклонить')
        }
        // Принудительно включаем анонимность для согласования
        formData.security = true
      } else {
        // Возвращаем обычные варианты для голосования
        if (formData.options.length < 2) {
          formData.options = ['', '']
        }
      }
    })

    // Следим за включением/выключением отклонения
    watch(() => formData.allowRejection, (newValue) => {
      if (formData.mode === 'approval') {
        if (newValue && formData.options.length === 1) {
          formData.options.push('Отклонить')
        } else if (!newValue && formData.options.length > 1) {
          formData.options = ['Согласовать']
        }
      }
    })

    // Добавление нового варианта ответа
    const addOption = () => {
      if (formData.mode === 'vote') {
        formData.options.push('')
      }
    }

    // Удаление варианта ответа
    const removeOption = (index) => {
      if (formData.mode === 'vote' && formData.options.length > 2) {
        formData.options.splice(index, 1)
      }
    }

    // Открытие диалога выбора пользователей через BX24
    const openUserSelector = () => {
      if (typeof BX24 !== 'undefined' && BX24.selectUsers) {
        BX24.selectUsers(handleUserSelection)
      } else {
        console.error('BX24 не инициализирован или метод selectUsers не доступен')
        showNotification('error', 'Не удалось открыть диалог выбора пользователей')
      }
    }

    // Обработка выбора пользователей
    const handleUserSelection = (users) => {
      if (Array.isArray(users) && users.length > 0) {
        // Создаем уникальный список пользователей
        const existingIds = new Set(selectedUsers.value.map(u => u.id))
        const newUsers = users.filter(user => !existingIds.has(user.id))

        if (newUsers.length > 0) {
          // Добавляем новых пользователей
          selectedUsers.value.push(...newUsers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email || '',
            department: user.department || '',
            position: user.position || ''
          })))

          showNotification('success', `Добавлено ${newUsers.length} новых участников`)
        } else {
          showNotification('info', 'Все выбранные пользователи уже добавлены')
        }
      } else {
        showNotification('info', 'Пользователи не выбраны')
      }
    }

    // Удаление пользователя из списка
    const removeUser = (userId) => {
      const userName = selectedUsers.value.find(u => u.id === userId)?.name
      selectedUsers.value = selectedUsers.value.filter(user => user.id !== userId)

      if (userName) {
        showNotification('info', `Пользователь "${userName}" удален из списка`)
      }
    }

    // Очистка всех пользователей
    const clearAllUsers = () => {
      if (selectedUsers.value.length > 0) {
        selectedUsers.value = []
        showNotification('info', 'Список участников очищен')
      }
    }

    // Получение инициалов пользователя для аватара
    const getUserInitials = (name) => {
      if (!name) return '?'
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }

    // Показать уведомление
    const showNotification = (type, message) => {
      switch (type) {
        case 'success':
          toast.add({
            description: message,
            variant: 'success'
          })
          break
        case 'error':
          toast.add({
            description: message,
            variant: 'error'
          })
          break
        case 'warning':
          toast.add({
            description: message,
            variant: 'warning'
          })
          break
        case 'info':
          toast.add({
            description: message,
            variant: 'info'
          })
          break
      }
    }

    // Обработка отправки формы
    const handleSubmit = async () => {
      // Валидация вопроса
      if (!formData.subject.trim()) {
        generatedMessage.value = 'Введите вопрос опроса'
        messageType.value = 'error'
        showNotification('error', 'Введите вопрос опроса')
        setTimeout(() => {
          generatedMessage.value = ''
        }, 3000)
        return
      }

      // Проверяем выбор участников
      if (selectedUsers.value.length === 0) {
        generatedMessage.value = 'Выберите хотя бы одного участника'
        messageType.value = 'error'
        showNotification('error', 'Выберите хотя бы одного участника')
        setTimeout(() => {
          generatedMessage.value = ''
        }, 3000)
        return
      }

      // Проверяем минимальное количество вариантов
      const validOptions = formData.options.filter(option => option.trim())
      if (validOptions.length < minOptions.value) {
        generatedMessage.value = `Добавьте как минимум ${minOptions.value} вариант(а) ответа`
        messageType.value = 'error'
        showNotification('error', `Добавьте как минимум ${minOptions.value} вариант(а) ответа`)
        setTimeout(() => {
          generatedMessage.value = ''
        }, 3000)
        return
      }

      // Проверяем, что все варианты заполнены
      const hasEmptyOptions = formData.options.some(option => !option.trim())
      if (hasEmptyOptions) {
        generatedMessage.value = 'Заполните все варианты ответов'
        messageType.value = 'error'
        showNotification('error', 'Заполните все варианты ответов')
        setTimeout(() => {
          generatedMessage.value = ''
        }, 3000)
        return
      }

      isSubmitting.value = true

      try {
        // Подготовка данных для отправки
        const pollData = {
          subject: formData.subject.trim(),
          mode: formData.mode,
          security: formData.security,
          showVotes: formData.showVotes,
          notifyOnComplete: formData.notifyOnComplete,
          multipleChoice: formData.mode === 'vote' ? formData.multipleChoice : undefined,
          allowRejection: formData.mode === 'approval' ? formData.allowRejection : undefined,
          options: formData.options.map(opt => opt.trim()).filter(opt => opt),
          participants: selectedUsers.value.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email || '',
            department: user.department || '',
            position: user.position || ''
          }))
        }

        console.log('Отправка данных опроса:', pollData)

        // Здесь должна быть логика отправки данных на сервер
        // Например: await $fetch('/api/create-poll', { method: 'POST', body: pollData })

        // Имитация успешного создания
        generatedMessage.value = `Опрос успешно создан! Участники: ${selectedUsers.value.length} человек`
        messageType.value = 'success'
        showNotification('success', `Опрос "${formData.subject.trim()}" создан для ${selectedUsers.value.length} участников`)

        // Очистка формы (опционально)
        setTimeout(() => {
          resetForm()
          generatedMessage.value = ''
        }, 5000)

      } catch (error) {
        console.error('Ошибка при создании опроса:', error)
        generatedMessage.value = 'Произошла ошибка при создании опроса'
        messageType.value = 'error'
        showNotification('error', 'Произошла ошибка при создании опроса')
        setTimeout(() => {
          generatedMessage.value = ''
        }, 3000)
      } finally {
        isSubmitting.value = false
      }
    }

    // Сброс формы к начальным значениям
    const resetForm = () => {
      formData.subject = ''
      formData.mode = 'vote'
      formData.security = true
      formData.showVotes = true
      formData.notifyOnComplete = false
      formData.allowRejection = false
      formData.multipleChoice = false
      formData.options = ['', '']
      selectedUsers.value = []
    }

    // Инициализация Bitrix24
    const initializeBitrix24 = () => {
      if (typeof BX24 !== 'undefined') {
        BX24.init(() => {
          console.log('Bitrix24 SDK инициализирован')
          // Здесь можно добавить дополнительную инициализацию
        })
      } else {
        console.warn('Bitrix24 SDK не найден')
      }
    }

    // Инициализация при монтировании
    onMounted(() => {
      initializeBitrix24()
    })

    return {
      formData,
      pollForm,
      generatedMessage,
      messageType,
      isSubmitting,
      showSettings,
      minOptions,
      addOption,
      removeOption,
      handleSubmit,
      resetForm,
      // Управление пользователями
      selectedUsers,
      openUserSelector,
      removeUser,
      clearAllUsers,
      getUserInitials
    }
  }
}
</script>

<style scoped>
.poll-form-wrapper {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.poll-form-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.poll-card {
  width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e6ed;
  overflow: hidden;
}

.poll-card-header {
  background: linear-gradient(90deg, #4a90e2 0%, #357ae8 100%);
  padding: 32px 40px;
  border-bottom: 1px solid #e0e6ed;
}

.poll-title {
  color: white;
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
}

.poll-card-content {
  padding: 40px;
}

.poll-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  display: block;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.form-label.required::after {
  content: " *";
  color: #ff4444;
}

.question-input {
  width: 100%;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.question-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

/* Переключение режима */
.mode-switcher-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mode-switcher {
  display: flex;
  gap: 12px;
  width: 100%;
}

.mode-btn {
  flex: 1;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 2px solid #cbd5e1;
  background: white;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.mode-btn.active {
  background: linear-gradient(90deg, #4a90e2 0%, #357ae8 100%);
  color: white;
  border-color: #4a90e2;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}

.mode-btn:hover:not(.active) {
  border-color: #4a90e2;
  color: #4a90e2;
}

.mode-icon {
  font-size: 18px;
}

.mode-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #4a90e2;
}

/* Участники опроса */
.participants-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 28px;
  border: 1px solid #e2e8f0;
}

.section-title {
  color: #1e293b;
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
}

.section-description {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.participants-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.select-users-btn {
  align-self: flex-start;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  border: 2px solid #4a90e2;
  background: #4a90e2;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-users-btn:hover {
  background: #357ae8;
  border-color: #357ae8;
  transform: translateY(-1px);
}

.selector-icon {
  font-size: 16px;
}

.selected-users-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding: 4px;
  margin-top: 8px;
}

.selected-user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  animation: slideIn 0.3s ease-out;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2 0%, #357ae8 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
}

.user-id {
  font-size: 12px;
  color: #64748b;
}

.remove-user-btn {
  background: none;
  border: none;
  color: #e53e3e;
  font-size: 20px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.remove-user-btn:hover {
  background-color: #fed7d7;
}

.clear-users-btn {
  align-self: flex-start;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid #fed7d7;
  background: #fff5f5;
  color: #e53e3e;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-users-btn:hover {
  background: #fed7d7;
}

.selection-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #e0f2fe;
  border-radius: 8px;
  border: 1px solid #4a90e2;
  margin-top: 16px;
}

.info-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.info-text {
  font-size: 14px;
  color: #1e293b;
  line-height: 1.5;
}

.info-text strong {
  font-weight: 600;
  color: #4a90e2;
}

/* Варианты ответов */
.options-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 28px;
  border: 1px solid #e2e8f0;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.option-item {
  animation: slideIn 0.3s ease-out;
}

.option-field-wrapper {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.option-form-group {
  flex: 1;
  margin-bottom: 0;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 500;
  color: #475569;
}

.option-type {
  color: #4a90e2;
  font-size: 13px;
  font-weight: 400;
}

.option-input {
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
}

.option-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.option-input:disabled {
  background: #f1f5f9;
  color: #475569;
  cursor: not-allowed;
}

.remove-btn {
  margin-top: 28px;
  white-space: nowrap;
  padding: 8px 16px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  color: #e53e3e;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fed7d7;
}

.add-option-btn {
  align-self: flex-start;
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px dashed #cbd5e1;
  background: white;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  font-size: 15px;
}

.add-option-btn:hover {
  border-color: #4a90e2;
  color: #4a90e2;
  background: #f0f7ff;
}

/* Настройки */
.settings-section {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.settings-accordion {
  background: #f8fafc;
}

.accordion-header {
  display: flex;
  align-items: center;
  padding: 20px 28px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  user-select: none;
}

.accordion-icon {
  font-size: 20px;
  margin-right: 12px;
}

.accordion-title {
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.accordion-arrow {
  font-size: 14px;
  color: #64748b;
}

.settings-content {
  padding: 28px;
  background: white;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 0;
  border-bottom: 1px solid #f1f5f9;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label-wrapper {
  flex: 1;
  margin-right: 24px;
}

.setting-label {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 6px;
}

.setting-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

/* Свитчер */
.switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.switch input:checked + .switch-slider {
  background-color: #4a90e2;
}

.switch input:checked + .switch-slider:before {
  transform: translateX(24px);
}

.switch input:disabled + .switch-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Сообщение */
.message-alert {
  padding: 16px 20px;
  border-radius: 10px;
  position: relative;
  margin: 24px 0 0 0;
}

.message-alert.success {
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  color: #2e7d32;
}

.message-alert.error {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  color: #c62828;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.alert-message {
  font-size: 14px;
}

.alert-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
}

.alert-close:hover {
  opacity: 1;
}

/* Кнопка отправки */
.submit-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #e2e8f0;
}

.submit-btn {
  width: 100%;
  padding: 18px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(90deg, #4a90e2 0%, #357ae8 100%);
  border: none;
  transition: all 0.3s ease;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  animation: spin 1s linear infinite;
}

.participants-count {
  font-size: 14px;
  opacity: 0.9;
  margin-left: 8px;
}

/* Анимации */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .poll-form-wrapper {
    padding: 16px;
  }

  .poll-card-header {
    padding: 24px 20px;
  }

  .poll-title {
    font-size: 24px;
  }

  .poll-card-content {
    padding: 24px;
  }

  .poll-form {
    gap: 24px;
  }

  .mode-switcher {
    flex-direction: column;
  }

  .mode-btn {
    width: 100%;
  }

  .participants-section,
  .options-section {
    padding: 20px;
  }

  .option-field-wrapper {
    flex-direction: column;
  }

  .remove-btn {
    align-self: flex-end;
    margin-top: 12px;
  }

  .accordion-header {
    padding: 16px 20px;
  }

  .settings-content {
    padding: 20px;
  }

  .setting-item {
    flex-direction: column;
    gap: 16px;
  }

  .setting-label-wrapper {
    margin-right: 0;
  }

  .submit-btn {
    padding: 16px 24px;
  }

  .selected-user-item {
    padding: 10px;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .poll-form-container {
    max-width: 800px;
  }
}

@media (min-width: 1025px) {
  .poll-form-wrapper {
    padding: 32px;
  }

  .poll-form-container {
    max-width: 900px;
  }
}
</style>