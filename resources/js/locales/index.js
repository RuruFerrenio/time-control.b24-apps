// locales/index.js
export const messages = {
  ru: {
    app: {
      title: "Калькулятор в CRM",
      version: "Версия 1.0.0",
      settings: {
        title: "Настройки приложения",
        description: "Настройте параметры работы вашего приложения"
      },
      guide: "Руководство пользователя",
      support: "Поддержка",
      otherSolutions: "Другие наши решения",
      expandCapabilities: "Расширьте возможности вашего Битрикс24",
      slideCounter: "{current} из {total}",
      currentLanguage: "Текущий язык"
    },
    chatCalculator: {
      title: "Калькулятор в чате",
      description: "Включите эту опцию, чтобы добавить калькулятор в чаты",
      additionalSettings: "Дополнительные параметры",
      chatPanel: {
        title: "Калькулятор в панели чата",
        description: "Отображать калькулятор в панели ввода сообщения чата"
      },
      chatSidebar: {
        title: "Калькулятор в сайдбаре чата",
        description: "Отображать калькулятор в правой боковой панели чата"
      }
    },
    taskCalculator: {
      title: "Калькулятор в задачах",
      description: "Включите эту опцию, чтобы добавить калькулятор в задачи",
      additionalSettings: "Дополнительные параметры",
      taskSidebar: {
        title: "Калькулятор в сайдбаре задачи",
        description: "Отображать калькулятор в боковой панели просмотра задачи"
      },
      taskTab: {
        title: "Калькулятор в табе задачи",
        description: "Отображать калькулятор в отдельной вкладке при просмотре задачи"
      }
    },
    userFieldType: {
      title: "Пользовательский тип поля Калькулятор",
      description: "Зарегистрировать новый тип пользовательского поля для использования калькулятора в сущностях CRM",
      info: "Информация о типе поля",
      fieldInfo: "Что такое пользовательские типы полей?",
      fieldInfoDescription: "После включения этих опций в настройках сделок, лидов, контактов, компаний и смарт-процессов появится новый тип поля Калькулятор CRM. Пользователи смогут добавить данное поле в любую из вышеобозначенных сущностей для выполнения расчетов прямо в CRM.",
      typeCode: "Код типа:",
      typeName: "Название:",
      typeDescription: "Описание:"
    },
    buttons: {
      open: "Открыть",
      details: "Подробнее",
      processing: "Обработка...",
      guide: "Руководство пользователя",
      support: "Поддержка",
      feedback: "Оставить отзыв"
    },
    notifications: {
      success: {
        chatAdded: "Калькулятор успешно добавлен в чат",
        chatRemoved: "Калькулятор успешно удален из чата",
        chatPanelAdded: "Калькулятор добавлен в панель чата",
        chatPanelRemoved: "Калькулятор удален из панели чата",
        chatSidebarAdded: "Калькулятор добавлен в сайдбар чата",
        chatSidebarRemoved: "Калькулятор удален из сайдбара чата",
        taskAdded: "Калькулятор успешно добавлен в задачи",
        taskRemoved: "Калькулятор успешно удален из задач",
        taskSidebarAdded: "Калькулятор добавлен в сайдбар задачи",
        taskSidebarRemoved: "Калькулятор удален из сайдбара задачи",
        taskTabAdded: "Калькулятор добавлен во вкладку задачи",
        taskTabRemoved: "Калькулятор удален из вкладки задачи",
        fieldTypeAdded: "Пользовательский тип поля Калькулятор в CRM успешно зарегистрирован",
        fieldTypeRemoved: "Пользовательский тип поля Калькулятор в CRM успешно удален",
        syncSuccess: "Статус настроек успешно синхронизирован",
        copySuccess: "Результат скопирован в буфер обмена",
        sendSuccess: "Результат отправлен в чат",
        historyCleared: "История очищена",
        expressionRestored: "Выражение восстановлено",
        angleModeChanged: "Режим углов: {mode}",
        callCardAdded: "Калькулятор успешно добавлен в карточку звонка",
        callCardRemoved: "Калькулятор успешно удален из карточки звонка"
      },
      error: {
        chatUpdate: "Ошибка при обновлении настроек чата",
        chatPanelUpdate: "Ошибка при обновлении панели чата",
        chatSidebarUpdate: "Ошибка при обновлении сайдбара чата",
        taskUpdate: "Ошибка при обновлении настроек задач",
        taskSidebarUpdate: "Ошибка при обновлении сайдбара задачи",
        taskTabUpdate: "Ошибка при обновлении вкладки задачи",
        fieldTypeUpdate: "Ошибка при обновлении типа поля",
        syncError: "Ошибка синхронизации статуса",
        settingsLoad: "Ошибка загрузки настроек",
        bitrixLoad: "Библиотека Bitrix24 не загружена. Проверьте подключение.",
        copyError: "Ошибка копирования",
        sendError: "Ошибка отправки сообщения",
        calculationError: "Ошибка вычисления",
        callCardUpdate: "Ошибка при обновлении карточки звонка"
      },
      warning: {
        bitrixLoad: "Библиотека Bitrix24 не загружена."
      },
      info: {
        syncInfo: "Статус настроек успешно синхронизирован"
      }
    },
    solutions: {
      calendarInCrm: {
        title: "Календарь в CRM",
        description: "Необходимый инструмент всегда под рукой! Позволяет вычислять кол-во дней между выбранными датами."
      },
      timerInCrm: {
        title: "Таймер в CRM",
        description: "Необходимый инструмент всегда под рукой! Позволяет считать время, потраченное на различные микрозадачи внутри системы."
      },
      noticeInCrm: {
        title: "Заметки в CRM",
        description: "Необходимый инструмент всегда под рукой! Позволяет пользователям записывать произвольную информацию внутри системы, не засоряя важные поля. "
      }
    },
    badges: {
      new: "Новинка",
      installed: "Установлено",
      popular: "Популярное"
    },
    calculator: {
      keyboardTitle: "Клавиатура калькулятора",
      engineeringTitle: "Инженерные функции",
      historyTitle: "История расчетов",
      helpTitle: "Справка по горячим клавишам",
      placeholder: "Введите выражение...",
      result: "Результат",
      equals: " = ",
      copy: "Копировать",
      send: "Отправить",
      clear: "C",
      backspace: "⌫",
      percentage: "%",
      equalsBtn: "=",
      point: ".",
      openParen: "(",
      closeParen: ")",
      pi: "π",
      e: "e",
      reciprocal: "1/x",
      power: "xʸ",
      square: "x²",
      squareRoot: "√",
      divide: "÷",
      multiply: "×",
      subtract: "−",
      add: "+",
      sin: "sin",
      cos: "cos",
      tan: "tan",
      asin: "asin",
      acos: "acos",
      atan: "atan",
      ln: "ln",
      log10: "log₁₀",
      exp: "eˣ",
      abs: "|x|",
      factorial: "n!",
      trigonometry: "Тригонометрия",
      mathematics: "Математика",
      constants: "Константы",
      additional: "Дополнительно",
      deg: "DEG",
      rad: "RAD",
      degrees: "Градусы",
      radians: "Радианы",
      emptyHistory: "История расчетов пуста",
      items: "{count}",
      clearHistory: "Очистить",
      helpIntro: "Все горячие клавиши работают, когда курсор находится в поле ввода выражения.",
      helpCategories: {
        basic: "Основные клавиши",
        operations: "Математические операции",
        parentheses: "Скобки и константы",
        numbers: "Цифры и точка"
      },
      helpItems: {
        calculate: "Вычислить результат:",
        clearAll: "Очистить всё:",
        deleteLast: "Удалить последний символ:",
        addition: "Сложение:",
        subtraction: "Вычитание:",
        multiplication: "Умножение:",
        division: "Деление:",
        power: "Возведение в степень:",
        percent: "Процент:",
        openParenthesis: "Открыть скобку:",
        closeParenthesis: "Закрыть скобку:",
        numbers: "Цифры:",
        decimalPoint: "Десятичная точка:",
      },
      hotkeys: {
        enter: "Enter",
        equals: "=",
        escape: "Esc",
        delete: "Del",
        backspace: "Backspace",
        plus: "+",
        minus: "-",
        asterisk: "*",
        slash: "/",
        caret: "^",
        percent: "%",
        openParen: "(",
        closeParen: ")",
        comma: ",",
        period: "."
      },
      divisionByZero: "Деление на ноль",
      error: "Ошибка",
      infinity: "∞",
      negativeInfinity: "-∞",
      calculationResult: "Результат расчета: {expression}"
    },
    callCardCalculator: {
      title: "Калькулятор в карточке звонка",
      description: "Встройка калькулятора во вкладку карточки звонка для быстрых расчетов во время разговора",
      info: "Информация о встройке",
      infoDescription: "Калькулятор будет отображаться во вкладке карточки звонка, предоставляя доступ к расчетам непосредственно во время телефонного разговора."
    },
    install: {
      title: "Установка Калькулятора в CRM",
      subtitle: "Настройте приложение под свои нужды за несколько простых шагов",
      progress: "Прогресс",
      welcome: {
        title: "Добро пожаловать!",
        description: "Приложение «Калькулятор в CRM» позволяет проводить математические расчеты прямо в интерфейсе Битрикс24. Настройте приложение под свои потребности."
      },
      features: {
        title: "Основные возможности",
        feature1: "Инженерный калькулятор с поддержкой сложных формул",
        feature2: "Интеграция в чаты, задачи и карточки звонков",
        feature3: "Пользовательские поля для всех сущностей CRM с калькулятором",
        feature4: "Поддержка горячих клавиш и истории расчетов"
      },
      placements: {
        title: "Выбор встроек",
        description: "Выберите, куда вы хотите добавить калькулятор. Вы можете изменить эти настройки позже.",
        imagePlaceholder: "Изображение встройки",
        alreadyInstalled: "Уже установлено",
        chat: {
          title: "Калькулятор в чате",
          description: "Интеграция калькулятора в чаты",
          feature1: "Расчеты прямо в панели ввода сообщения",
          feature2: "Отдельная панель в боковой колонке"
        },
        tasks: {
          title: "Калькулятор в задачах",
          description: "Интеграция калькулятора в задачи",
          feature2: "Отдельная вкладка с калькулятором"
        },
        callCard: {
          title: "Калькулятор в карточке звонка",
          description: "Расчеты во время телефонных разговоров",
          feature1: "Быстрые расчеты при общении с клиентом",
          feature2: "Интеграция с CRM карточкой звонка"
        },
        userField: {
          title: "Поле-калькулятор в CRM",
          description: "Пользовательское поле с калькулятором",
          feature1: "Добавление калькулятора в карточки всех сущностей CRM",
          feature2: "Расчеты прямо в полях сделок, лидов, контактов, компаний и смарт-процессов"
        }
      },
      installation: {
        title: "Установка встроек",
        description: "Идет установка выбранных вами интеграций. Пожалуйста, подождите...",
        selectedPlacements: "Выбранные для установки встройки",
        progress: "Прогресс установки",
        alreadyInstalled: "Уже установлено",
        reinstallWarning: "Существующие встройки будут переустановлены",
        willBeReinstalled: "Переустановка"
      },
      completion: {
        title: "Установка завершена!",
        description: "Приложение успешно установлено и настроено. Вы можете начать использовать калькулятор в выбранных вами разделах Битрикс24.",
        reviewTitle: "Оставьте отзыв",
        reviewDescription: "Помогите нам стать лучше! Оставьте отзыв о приложении на Маркетплейсе Битрикс24.",
        nextSteps: "Следующие шаги",
        step1: "Откройте любой чат, чтобы увидеть калькулятор в панели инструментов",
        step2: "Создайте или откройте задачу для доступа к калькулятору в задачах",
        step3: "Настройте пользовательские поля с типом «Калькулятор в CRM» и добавьте его в карточки сущностей CRM."
      },
      notifications: {
        installSuccess: "Все выбранные встройки успешно установлены",
        installError: "Произошла ошибка при установке некоторых встроек",
        finishError: "Ошибка завершения установки"
      },
      buttons: {
        start: "Начать установку",
        back: "Назад",
        continue: "Продолжить",
        install: "Установить",
        finish: "Завершить",
        complete: "Завершить установку",
        review: "Оставить отзыв",
        support: "Поддержка",
        settings: "Настройки",
        close: "Закрыть",
        reinstall: "Переустановить"
      }
    }
  },
  en: {
    app: {
      title: "Calculator in CRM",
      version: "Version 1.0.0",
      settings: {
        title: "Application Settings",
        description: "Configure your application working parameters"
      },
      guide: "User Guide",
      support: "Support",
      otherSolutions: "Our Other Solutions",
      expandCapabilities: "Expand your Bitrix24 capabilities",
      slideCounter: "{current} of {total}",
      currentLanguage: "Current language"
    },
    chatCalculator: {
      title: "Calculator in Chat",
      description: "Enable this option to add calculator to chats",
      additionalSettings: "Additional parameters",
      chatPanel: {
        title: "Calculator in Chat Panel",
        description: "Display calculator in chat message input panel"
      },
      chatSidebar: {
        title: "Calculator in Chat Sidebar",
        description: "Display calculator in right chat sidebar"
      }
    },
    taskCalculator: {
      title: "Calculator in Tasks",
      description: "Enable this option to add calculator to tasks",
      additionalSettings: "Additional parameters",
      taskSidebar: {
        title: "Calculator in Task Sidebar",
        description: "Display calculator in task view sidebar"
      },
      taskTab: {
        title: "Calculator in Task Tab",
        description: "Display calculator in separate tab when viewing task"
      }
    },
    userFieldType: {
      title: "Custom Field Type Calculator",
      description: "Register new custom field type for using calculator in CRM entities",
      info: "Field Type Information",
      fieldInfo: "What are custom field types?",
      fieldInfoDescription: "After enabling these options, a new field type Calculator CRM will appear in deal and lead settings. Administrator can add this field to deal or lead card to perform calculations directly in CRM.",
      typeCode: "Type code:",
      typeName: "Name:",
      typeDescription: "Description:"
    },
    buttons: {
      open: "Open",
      details: "Details",
      processing: "Processing...",
      guide: "User Guide",
      support: "Support",
      feedback: "Leave feedback"
    },
    notifications: {
      success: {
        chatAdded: "Calculator successfully added to chat",
        chatRemoved: "Calculator successfully removed from chat",
        chatPanelAdded: "Calculator added to chat panel",
        chatPanelRemoved: "Calculator removed from chat panel",
        chatSidebarAdded: "Calculator added to chat sidebar",
        chatSidebarRemoved: "Calculator removed from chat sidebar",
        taskAdded: "Calculator successfully added to tasks",
        taskRemoved: "Calculator successfully removed from tasks",
        taskSidebarAdded: "Calculator added to task sidebar",
        taskSidebarRemoved: "Calculator removed from task sidebar",
        taskTabAdded: "Calculator added to task tab",
        taskTabRemoved: "Calculator removed from task tab",
        fieldTypeAdded: "Custom field type Calculator in CRM successfully registered",
        fieldTypeRemoved: "Custom field type Calculator in CRM successfully removed",
        syncSuccess: "Settings status successfully synchronized",
        copySuccess: "Result copied to clipboard",
        sendSuccess: "Result sent to chat",
        historyCleared: "History cleared",
        expressionRestored: "Expression restored",
        angleModeChanged: "Angle mode: {mode}",
        callCardAdded: "Calculator successfully added to call card",
        callCardRemoved: "Calculator successfully removed from call card"
      },
      error: {
        chatUpdate: "Error updating chat settings",
        chatPanelUpdate: "Error updating chat panel",
        chatSidebarUpdate: "Error updating chat sidebar",
        taskUpdate: "Error updating task settings",
        taskSidebarUpdate: "Error updating task sidebar",
        taskTabUpdate: "Error updating task tab",
        fieldTypeUpdate: "Error updating field type",
        syncError: "Error synchronizing status",
        settingsLoad: "Error loading settings",
        bitrixLoad: "Bitrix24 library not loaded. Check connection.",
        copyError: "Error copying",
        sendError: "Error sending message",
        calculationError: "Calculation error",
        callCardUpdate: "Error updating call card"
      },
      warning: {
        bitrixLoad: "Bitrix24 library not loaded."
      },
      info: {
        syncInfo: "Settings status successfully synchronized"
      }
    },
    solutions: {
      calendarInCrm: {
        title: "Calendar in CRM",
        description: "Automatic generation of reports and sales analytics"
      },
      timerInCrm: {
        title: "Timer in CRM",
        description: "Intelligent task distribution and project management"
      },
      noticeInCrm: {
        title: "Notes in CRM",
        description: "Intelligent task distribution and project management"
      }
    },
    badges: {
      new: "New",
      installed: "Installed",
      popular: "Popular"
    },
    calculator: {
      keyboardTitle: "Calculator Keyboard",
      engineeringTitle: "Engineering Functions",
      historyTitle: "Calculation History",
      helpTitle: "Hotkeys Help",
      placeholder: "Enter expression...",
      result: "Result",
      equals: " = ",
      copy: "Copy",
      send: "Send",
      clear: "C",
      backspace: "⌫",
      percentage: "%",
      equalsBtn: "=",
      point: ".",
      openParen: "(",
      closeParen: ")",
      pi: "π",
      e: "e",
      reciprocal: "1/x",
      power: "xʸ",
      square: "x²",
      squareRoot: "√",
      divide: "÷",
      multiply: "×",
      subtract: "−",
      add: "+",
      sin: "sin",
      cos: "cos",
      tan: "tan",
      asin: "asin",
      acos: "acos",
      atan: "atan",
      ln: "ln",
      log10: "log₁₀",
      exp: "eˣ",
      abs: "|x|",
      factorial: "n!",
      trigonometry: "Trigonometry",
      mathematics: "Mathematics",
      constants: "Constants",
      additional: "Additional",
      deg: "DEG",
      rad: "RAD",
      degrees: "Degrees",
      radians: "Radians",
      emptyHistory: "Calculation history is empty",
      items: "{count}",
      clearHistory: "Clear",
      helpIntro: "All hotkeys work when the cursor is in the expression input field.",
      helpCategories: {
        basic: "Basic Keys",
        operations: "Mathematical Operations",
        parentheses: "Parentheses and Constants",
        numbers: "Numbers and Decimal Point"
      },
      helpItems: {
        calculate: "Calculate result:",
        clearAll: "Clear all:",
        deleteLast: "Delete last character:",
        addition: "Addition:",
        subtraction: "Subtraction:",
        multiplication: "Multiplication:",
        division: "Division:",
        power: "Power:",
        percent: "Percentage:",
        openParenthesis: "Open parenthesis:",
        closeParenthesis: "Close parenthesis:",
        numbers: "Numbers:",
        decimalPoint: "Decimal point:",
        or: "or"
      },
      hotkeys: {
        enter: "Enter",
        equals: "=",
        escape: "Esc",
        delete: "Del",
        backspace: "Backspace",
        plus: "+",
        minus: "-",
        asterisk: "*",
        slash: "/",
        caret: "^",
        percent: "%",
        openParen: "(",
        closeParen: ")",
        comma: ",",
        period: "."
      },
      divisionByZero: "Division by zero",
      error: "Error",
      infinity: "∞",
      negativeInfinity: "-∞",
      calculationResult: "Calculation result: {expression}"
    },
    callCardCalculator: {
      title: "Calculator in Call Card",
      description: "Embed calculator in call card tab for quick calculations during calls",
      info: "Embed Information",
      infoDescription: "The calculator will appear in the call card tab, providing access to calculations directly during phone conversations."
    },
    install: {
      title: "Calculator in CRM Installation",
      subtitle: "Configure the application for your needs in a few simple steps",
      progress: "Progress",
      welcome: {
        title: "Welcome!",
        description: "The Calculator in CRM application allows you to perform mathematical calculations directly in the Bitrix24 interface. Customize the integration according to your needs."
      },
      features: {
        title: "Main features",
        feature1: "Engineering calculator with support for complex formulas",
        feature2: "Integration into chats, tasks and call cards",
        feature3: "Custom fields for CRM with calculator",
        feature4: "Hotkey support and calculation history"
      },
      placements: {
        title: "Placement Selection",
        description: "Choose where you want to add the calculator. You can change these settings later.",
        imagePlaceholder: "Placement image",
        alreadyInstalled: "Already installed",
        chat: {
          title: "Calculator in Chat",
          description: "Calculator integration into chats",
          feature1: "Calculations directly in the message input panel",
          feature2: "Separate panel in the sidebar"
        },
        tasks: {
          title: "Calculator in Tasks",
          description: "Calculator integration into tasks",
          feature1: "Sidebar for calculations in tasks",
          feature2: "Separate tab with calculator"
        },
        callCard: {
          title: "Calculator in Call Card",
          description: "Calculations during phone conversations",
          feature1: "Quick calculations when communicating with a client",
          feature2: "Integration with CRM call card"
        },
        userField: {
          title: "Calculator Field in CRM",
          description: "Custom field with calculator",
          feature1: "Adding calculator to CRM cards",
          feature2: "Calculations directly in deal and lead fields"
        }
      },
      installation: {
        title: "Placement Installation",
        description: "The integrations you selected are being installed. Please wait...",
        selectedPlacements: "Selected placements for installation",
        progress: "Installation progress",
        alreadyInstalled: "Already installed",
        reinstallWarning: "Existing installations will be reinstalled",
        willBeReinstalled: "Reinstallation"
      },
      completion: {
        title: "Installation Complete!",
        description: "The application has been successfully installed and configured. You can start using the calculator in the Bitrix24 sections you selected.",
        reviewTitle: "Leave a Review",
        reviewDescription: "Help us improve! Leave feedback about the application on Bitrix24 Marketplace.",
        nextSteps: "Next Steps",
        step1: "Open any chat to see the calculator in the tools panel",
        step2: "Create or open a task to access the calculator in tasks",
        step3: "Configure custom fields with type Calculator in CRM"
      },
      notifications: {
        installSuccess: "All selected placements have been successfully installed",
        installError: "An error occurred while installing some placements",
        finishError: "Installation completion error"
      },
      buttons: {
        start: "Start Installation",
        back: "Back",
        continue: "Continue",
        install: "Install",
        finish: "Finish",
        complete: "Complete Installation",
        review: "Leave Review",
        support: "Support",
        settings: "Settings",
        close: "Close",
        reinstall: "Reinstall"
      }
    }
  },
  kk: {
    app: {
      title: "CRM-дегі калькулятор",
      version: "Нұсқасы 1.0.0",
      settings: {
        title: "Қолданба параметрлері",
        description: "Қолданба жұмыс параметрлерін баптаңыз"
      },
      guide: "Пайдаланушы нұсқаулығы",
      support: "Қолдау",
      otherSolutions: "Біздің басқа шешімдеріміз",
      expandCapabilities: "Bitrix24 мүмкіндіктерін кеңейтіңіз",
      slideCounter: "{current} / {total}",
      currentLanguage: "Ағымдағы тіл"
    },
    chatCalculator: {
      title: "Чаттағы калькулятор",
      description: "Чаттарға калькуляторды қосу үшін бұл опцияны қосыңыз",
      additionalSettings: "Қосымша параметрлер",
      chatPanel: {
        title: "Чат панеліндегі калькулятор",
        description: "Чат хабарламасы енгізу панелінде калькуляторды көрсету"
      },
      chatSidebar: {
        title: "Чат бүйірлік панеліндегі калькулятор",
        description: "Чаттың оң жақ бүйірлік панелінде калькуляторды көрсету"
      }
    },
    taskCalculator: {
      title: "Тапсырмалардағы калькулятор",
      description: "Тапсырмаларға калькуляторды қосу үшін бұл опцияны қосыңыз",
      additionalSettings: "Қосымша параметрлер",
      taskSidebar: {
        title: "Тапсырма бүйірлік панеліндегі калькулятор",
        description: "Тапсырманы қарау кезінде бүйірлік панельде калькуляторды көрсету"
      },
      taskTab: {
        title: "Тапсырма қойыншасындағы калькулятор",
        description: "Тапсырманы қарау кезінде жеке қойыншада калькуляторды көрсету"
      }
    },
    userFieldType: {
      title: "Калькулятор деген пайдаланушылық өріс түрі",
      description: "CRM нысандарында калькуляторды пайдалану үшін жаңа пайдаланушылық өріс түрін тіркеу",
      info: "Өріс түрі туралы ақпарат",
      fieldInfo: "Пайдаланушылық өріс түрлері деген не?",
      fieldInfoDescription: "Бұл опцияларды қосқаннан кейін мәміле және лид баптауларында CRM калькуляторы деген жаңа өріс түрі пайда болады. Әкімші бұл өрісті мәміле немесе лид карточкасына қоса алады және CRM-де тікелей есептеулерді орындай алады.",
      typeCode: "Түр коды:",
      typeName: "Атауы:",
      typeDescription: "Сипаттама:"
    },
    buttons: {
      open: "Ашу",
      details: "Толығырақ",
      processing: "Өңделуде...",
      guide: "Пайдаланушы нұсқаулығы",
      support: "Қолдау",
      feedback: "Пікір қалдыру"
    },
    notifications: {
      success: {
        chatAdded: "Калькулятор чатқа сәтті қосылды",
        chatRemoved: "Калькулятор чаттан сәтті жойылды",
        chatPanelAdded: "Калькулятор чат панеліне қосылды",
        chatPanelRemoved: "Калькулятор чат панелінен жойылды",
        chatSidebarAdded: "Калькулятор чат бүйірлік панеліне қосылды",
        chatSidebarRemoved: "Калькулятор чат бүйірлік панелінен жойылды",
        taskAdded: "Калькулятор тапсырмаларға сәтті қосылды",
        taskRemoved: "Калькулятор тапсырмалардан сәтті жойылды",
        taskSidebarAdded: "Калькулятор тапсырма бүйірлік панеліне қосылды",
        taskSidebarRemoved: "Калькулятор тапсырма бүйірлік панелінен жойылды",
        taskTabAdded: "Калькулятор тапсырма қойыншасына қосылды",
        taskTabRemoved: "Калькулятор тапсырма қойыншасынан жойылды",
        fieldTypeAdded: "CRM-дегі калькулятор пайдаланушылық өріс түрі сәтті тіркелді",
        fieldTypeRemoved: "CRM-дегі калькулятор пайдаланушылық өріс түрі сәтті жойылды",
        syncSuccess: "Баптаулар күйі сәтті синхрондалды",
        copySuccess: "Нәтиже алмасу буферіне көшірілді",
        sendSuccess: "Нәтиже чатқа жіберілді",
        historyCleared: "Тарих тазартылды",
        expressionRestored: "Өрнек қалпына келтірілді",
        angleModeChanged: "Бұрыш режимі: {mode}",
        callCardAdded: "Калькулятор қоңырау карточкасына сәтті қосылды",
        callCardRemoved: "Калькулятор қоңырау карточкасынан сәтті жойылды"
      },
      error: {
        chatUpdate: "Чат баптауларын жаңарту кезінде қате",
        chatPanelUpdate: "Чат панелін жаңарту кезінде қате",
        chatSidebarUpdate: "Чат бүйірлік панелін жаңарту кезінде қате",
        taskUpdate: "Тапсырма баптауларын жаңарту кезінде қате",
        taskSidebarUpdate: "Тапсырма бүйірлік панелін жаңарту кезінде қате",
        taskTabUpdate: "Тапсырма қойыншасын жаңарту кезінде қате",
        fieldTypeUpdate: "Өріс түрін жаңарту кезінде қате",
        syncError: "Күйді синхрондау кезінде қате",
        settingsLoad: "Баптауларды жүктеу кезінде қате",
        bitrixLoad: "Bitrix24 кітапханасы жүктелмеді. Байланысты тексеріңіз.",
        copyError: "Көшіру кезінде қате",
        sendError: "Хабарламаны жіберу кезінде қате",
        calculationError: "Есептеу қатесі",
        callCardUpdate: "Қоңырау карточкасын жаңарту кезінде қате"
      },
      warning: {
        bitrixLoad: "Bitrix24 кітапханасы жүктелмеді."
      },
      info: {
        syncInfo: "Баптаулар күйі сәтті синхрондалды"
      }
    },
    solutions: {
      calendarInCrm: {
        title: "CRM жүйесіндегі күнтізбе",
        description: "Есептер мен сату аналитикасын автоматты түрде жасау"
      },
      timerInCrm: {
        title: "CRM жүйесіндегі таймер",
        description: "Тапсырманы интеллектуалды тарату және жобаны басқару"
      },
      noticeInCrm: {
        title: "CRM ішіндегі ескертпелер",
        description: "Тапсырманы интеллектуалды тарату және жобаны басқару"
      }
    },
    badges: {
      new: "Жаңа",
      installed: "Орнатылған",
      popular: "Танымал"
    },
    calculator: {
      keyboardTitle: "Калькулятор пернетақтасы",
      engineeringTitle: "Инженерлік функциялар",
      historyTitle: "Есептеулер тарихы",
      helpTitle: "Теңшеу пернелері туралы ақпарат",
      placeholder: "Өрнекті енгізіңіз...",
      result: "Нәтиже",
      equals: " = ",
      copy: "Көшіру",
      send: "Жіберу",
      clear: "C",
      backspace: "⌫",
      percentage: "%",
      equalsBtn: "=",
      point: ".",
      openParen: "(",
      closeParen: ")",
      pi: "π",
      e: "e",
      reciprocal: "1/x",
      power: "xʸ",
      square: "x²",
      squareRoot: "√",
      divide: "÷",
      multiply: "×",
      subtract: "−",
      add: "+",
      sin: "sin",
      cos: "cos",
      tan: "tan",
      asin: "asin",
      acos: "acos",
      atan: "atan",
      ln: "ln",
      log10: "log₁₀",
      exp: "eˣ",
      abs: "|x|",
      factorial: "n!",
      trigonometry: "Тригонометрия",
      mathematics: "Математика",
      constants: "Тұрақтылар",
      additional: "Қосымша",
      deg: "DEG",
      rad: "RAD",
      degrees: "Градус",
      radians: "Радиан",
      emptyHistory: "Есептеулер тарихы бос",
      items: "{count}",
      clearHistory: "Тазарту",
      helpIntro: "Барлық теңшеу пернелері өрнекті енгізу өрісінде болғанда жұмыс істейді.",
      helpCategories: {
        basic: "Негізгі пернелер",
        operations: "Математикалық амалдар",
        parentheses: "Жақшалар және тұрақтылар",
        numbers: "Сандар және ондық нүкте"
      },
      helpItems: {
        calculate: "Нәтижені есептеу:",
        clearAll: "Барлығын тазарту:",
        deleteLast: "Соңғы таңбаны жою:",
        addition: "Қосу:",
        subtraction: "Алу:",
        multiplication: "Көбейту:",
        division: "Бөлу:",
        power: "Дәреже:",
        percent: "Пайыз:",
        openParenthesis: "Жақшаны ашу:",
        closeParenthesis: "Жақшаны жабу:",
        numbers: "Сандар:",
        decimalPoint: "Ондық нүкте:",
        or: "немесе"
      },
      hotkeys: {
        enter: "Enter",
        equals: "=",
        escape: "Esc",
        delete: "Del",
        backspace: "Backspace",
        plus: "+",
        minus: "-",
        asterisk: "*",
        slash: "/",
        caret: "^",
        percent: "%",
        openParen: "(",
        closeParen: ")",
        comma: ",",
        period: "."
      },
      divisionByZero: "Нөлге бөлу",
      error: "Қате",
      infinity: "∞",
      negativeInfinity: "-∞",
      calculationResult: "Есептеу нәтижесі: {expression}"
    },
    callCardCalculator: {
      title: "Қоңырау карточкасындағы калькулятор",
      description: "Қоңырау кезінде тез есептеулер үшін қоңырау карточкасы қойыншасына калькуляторды енгізу",
      info: "Енгізу туралы ақпарат",
      infoDescription: "Калькулятор қоңырау карточкасы қойыншасында пайда болады және телефон сөйлесуі кезінде тікелей есептеулерге қол жеткізу мүмкіндігін береді."
    },
    install: {
      title: "CRM-дегі калькуляторды орнату",
      subtitle: "Бірнеше қарапайым қадамдарда қолданбаны өз қажеттіліктеріңізге сәйкес баптаңыз",
      progress: "Прогресс",
      welcome: {
        title: "Қош келдіңіз!",
        description: "CRM-дегі калькулятор қолданбасы сізге математикалық есептеулерді тікелей Bitrix24 интерфейсінде орындауға мүмкіндік береді. Өз қажеттіліктеріңізге сәйкес интеграцияны баптаңыз."
      },
      features: {
        title: "Негізгі мүмкіндіктер",
        feature1: "Күрделі формулаларды қолдайтын инженерлік калькулятор",
        feature2: "Чаттарға, тапсырмаларға және қоңырау карточкаларына интеграция",
        feature3: "Калькуляторы бар CRM үшін пайдаланушылық өрістер",
        feature4: "Теңшеу пернелері мен есептеулер тарихын қолдау"
      },
      placements: {
        title: "Енгізулерді таңдау",
        description: "Калькуляторды қайда қосқыңыз келетінін таңдаңыз. Бұл баптауларды кейінірек өзгерте аласыз.",
        imagePlaceholder: "Енгізу суреті",
        alreadyInstalled: "Қазірдің өзінде орнатылған",
        chat: {
          title: "Чаттағы калькулятор",
          description: "Чаттарға калькуляторды интеграциялау",
          feature1: "Хабарлама енгізу панелінде тікелей есептеулер",
          feature2: "Бүйірлік бағандағы жеке панель"
        },
        tasks: {
          title: "Тапсырмалардағы калькулятор",
          description: "Тапсырмаларға калькуляторды интеграциялау",
          feature1: "Тапсырмаларда есептеулер үшін бүйірлік панель",
          feature2: "Калькуляторы бар жеке қойынша"
        },
        callCard: {
          title: "Қоңырау карточкасындағы калькулятор",
          description: "Телефон әңгімелері кезіндегі есептеулер",
          feature1: "Тұтынушымен байланыс кезінде тез есептеулер",
          feature2: "CRM қоңырау карточкасына интеграция"
        },
        userField: {
          title: "CRM-дегі калькулятор өрісі",
          description: "Калькуляторы бар пайдаланушылық өріс",
          feature1: "Калькуляторды CRM карточкаларына қосу",
          feature2: "Мәмілелер мен лидтер өрістерінде тікелей есептеулер"
        }
      },
      installation: {
        title: "Енгізулерді орнату",
        description: "Сіз таңдаған интеграциялар орнатылуда. Күтіңіз...",
        selectedPlacements: "Орнату үшін таңдалған енгізулер",
        progress: "Орнату прогрессі",
        alreadyInstalled: "Қазірдің өзінде орнатылған",
        reinstallWarning: "Бар қондырғылар қайта орнатылады",
        willBeReinstalled: "Қайта орнату"
      },
      completion: {
        title: "Орнату аяқталды!",
        description: "Қолданба сәтті орнатылды және бапталды. Сіз таңдаған Bitrix24 бөлімдерінде калькуляторды пайдалана бастай аласыз.",
        reviewTitle: "Пікір қалдырыңыз",
        reviewDescription: "Біздің жақсырақ болуымызға көмектесіңіз! Bitrix24 Маркетплейсте қолданба туралы пікір қалдырыңыз.",
        nextSteps: "Келесі қадамдар",
        step1: "Кез келген чатты ашыңыз, құралдар панелінде калькуляторды көру үшін",
        step2: "Тапсырмалардағы калькуляторға қол жеткізу үшін тапсырма жасаңыз немесе ашыңыз",
        step3: "CRM-дегі калькулятор түрі бар пайдаланушылық өрістерді баптаңыз"
      },
      notifications: {
        installSuccess: "Барлық таңдалған енгізулер сәтті орнатылды",
        installError: "Кейбір енгізулерді орнату кезінде қате орын алды",
        finishError: "Орнатуды аяқтау қатесі"
      },
      buttons: {
        start: "Орнатуды бастау",
        back: "Артқа",
        continue: "Жалғастыру",
        install: "Орнату",
        finish: "Аяқтау",
        complete: "Орнатуды аяқтау",
        review: "Пікір қалдыру",
        support: "Қолдау",
        settings: "Баптаулар",
        close: "Жабу",
        reinstall: "Қайта орнату"
      }
    }
  },
};

export const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿', dir: 'ltr' },
];

export default messages;