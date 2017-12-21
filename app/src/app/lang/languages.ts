export class Languages {

  public static get languages(): Object {
    return {
      'it': {
        /* NAVBAR */
        'signout': 'esci',
        'dashboard': 'dashboard',
        'rules': 'regole',
        'actions': 'azioni',
        'fees': 'commissioni',
        'settings': 'impostazioni',
        'virtual_wallet_alert': 'Stai utilizzando il portafoglio virtuale. Le tue azioni saranno semplicemente simulate.',
        'virtual_wallet_alert_link': 'Clicca qui per cambiare questa impostazione',
        /* DASHBOARD */
        'connect_coinbase': 'Connetti da Coinbase',
        'last_two_weeks': 'Max e Min ultime due settimane',
        /* SIGNIN */
        'signin_coinbase': 'Accedi con Coinbase',
        'signin_email_password': 'o accedi con i tuoi dati',
        'signin': 'Accedi',
        'signin_error': 'Inserire email e password validi',
        /* AUTH */
        'auth_msg_1': 'Caricamento...',
        'auth_msg_2': 'Stiamo ricevendo i tuoi dati da Coinbase, attendi perfavore',
        'auth_msg_3': 'Sarai presto reindirizzato in automatico sulla Dashboard!',
        /* RULES */
        'create_new_rule': 'Crea Nuova Regola',
        'no_rules': 'Nessuna regola presente, creane una!',
        'wallet_with_currency': 'Portafoglio [0]',
        'coinbase_fees': 'Commissioni Coinbase',
        'fees_included': 'incluse',
        'fees_not_included': 'non incluse',
        'sell': 'vendere',
        'buy': 'comprare',
        'sell_you': 'vendi',
        'buy_you': 'compra',
        'automatically': 'automaticamente',
        'just_notification': 'Solo notifica',
        'run_rule_indefinitely': 'Eseguita sempre',
        'run_rule_once': 'Eseguita solo una volta',
        'active': 'Attiva',
        'deactive': 'Disattiva',
        'no_active': 'NON Attiva',
        'n_executions': 'Eseguita [0] volte',
        'connect_rule': 'Connetti Regola',
        'edit': 'Modifica',
        'delete': 'Elimina',
        'rule_description_fixed_price': 'Se il prezzo di [0] arriva a [1] € o [2], [3] [4] [5]',
        'rule_description_variable_price': 'Se il prezzo [0] [1] del [2] % rispetto al prezzo della regola #[3], allora [4] [5] [6]',
        'less': 'meno',
        'more': 'più',
        'goes_up': 'aumenta',
        'goes_down': 'diminuisce',
        'delete_rule': 'Elimina Regola',
        'delete_rule_question': 'Sei sicuro di vole eliminare la regola seguente?',
        'delete_rule_and_rules_connected': 'Eliminando la regola #[0], saranno eliminate anche tutte le regole ad essa connesse:',
        'close': 'Chiudi',
        /* RULES EDITOR*/
        'rule_name_label': 'Inserisci un nome, se vuoi (opzionale)',
        'rule_connect_rule_label': 'Vuoi collegare questa regola ad un altra regola già esistente? (opzionale)',
        'select_rule_label': 'Seleziona una regola',
        'rule_wallet_label': 'Quale portafoglio vuoi utilizzare?',
        'select_wallet_label': 'Seleziona un portafoglio',
        'rule_price_label': 'Vuoi utilizzare un prezzo fisso o variabile?',
        'select_price_label': 'Scegli una tipologia di prezzo',
        'price_fixed': 'Prezzo fisso',
        'price_variable': 'Prezzo variabile',
        'price_label': 'Quindi, se il prezzo è',
        'price_Variable_label': 'Quindi, se il prezzo',
        'by': 'del',
        'compared_to_price': 'rispetto al prezzo di [0] della regola collegata : ',
        'or': 'o',
        'per': 'per',
        'rule_action_label': 'Allora, cosa vuoi fare? Comprare o vendere?',
        'choose': 'Scegli',
        'which_currency': 'In quale valuta?',
        'rule_include_fees_label': 'Vuoi includere le',
        'rule_include_fees_yes': 'Si, il prezzo inserito include le commissioni di Coinbase',
        'rule_include_fees_no': 'No, il prezzo inserito NON include le commissioni di Coinbase',
        'how_much': 'Quanto?',
        'rule_auto_label': 'Permetti a Nostradamus di [0] automaticamente, o preferisci ricevere solo una notifica?',
        'rule_auto_yes': 'Si, [0] automaticamente!',
        'rule_auto_no': 'No, voglio solo una notifica!',
        'rule_loop_label': 'Vuoi che questa regola sia eseguita sempre o solo una volta?',
        'rule_loop_yes': 'Si, esegui questa regola ogni volta',
        'rule_loop_no': 'No, esegui questa regola solo una volta',
        'reset': 'Reset',
        'save': 'Salva',
        'create': 'Crea',
        'purchase': 'acquisto',
        'sale': 'vendita',
        'buying': 'acquisto',
        'selling': 'vendita',
        /* ACTIONS */
        'no_actions': 'Non è stata eseguita nessuna azione',
        'total': 'totale',
        'purchased': 'acquistato',
        'sold': 'venduto',
        'equivalent_to': 'equivalente a',
        'spent': 'speso',
        'received': 'ricevuto',
        'rule_executed': 'Regola eseguita',
        'rule_was_deleted': 'questa regola è stata eliminata',
        /* SETTINGS */
        'wallet_type_label': 'Vuoi usare il portafoglio virtuale? Il portafoglio virtuale simulerà le transazioni.',
        'virtual_wallet': 'portafoglio virtuale',
        'real_wallet': 'portafoglio reale',
        'disconnect_wallet': 'Disconnetti portafoglio di Coinbase',
        'disconnect_wallet_label': 'Se vuoi disconnettere un protafoglio di Coinbase da NostradamusBot, selezionalo dalla lista e clicca il bottone:',
        'disconnect_wallet_button': 'Disconnetti portafoglio',
        'disconnect_wallet_modal_msg': 'Vuoi disconnettere il tuo protafoglio [0] da NostradamusBot?',
        'disconnect_wallet_modal_msg_all_rules': 'Tutte le regole relative a questo portafoglio saranno eliminate.',
        'disconnect_wallet_modal_msg_all_actions': 'Tutte le azioni relative a questo portafoglio saranno eliminate.',
        'disconnect': 'disconnetti',
        'delete_account': 'Elimina account',
        'delete_account_label': 'Se vuoi eliminare il tuo account da NostradamusBot, clicca il pulsante e segui le istruzioni:',
        'delete_account_button': 'Elimina il mio account',
        'delete_account_modal_msg': 'Sei sicuro di voler eliminare il tuo account da NostradamusBot?',
        /* FEES */
        'paid': 'pagato',
        'unpaid': 'non pagato',
        'fee': 'commissione',
        'relative_to': 'Relativa a',
        'action_executed': 'Azione eseguita',
        'show_details': 'Mostra dettagli',
        'hide_details': 'Nascondi dettagli',
        'make_payment': 'Effettua pagamento',
        'select_payment_method': 'Seleziona un metodo di pagamento',
        'no_fees': 'Nessuna commissione presente',
        /* FOOTER */
        'privacy_policy': 'Privacy Policy'
      },
      'en': {
        /* NAVBAR */
        'signout': 'signout',
        'dashboard': 'dashboard',
        'rules': 'rules',
        'actions': 'actions',
        'fees': 'fees',
        'settings': 'settings',
        'virtual_wallet_alert': 'You are using the virtual wallet. Your actions will be just simulated',
        'virtual_wallet_alert_link': 'Click here to change this setting.',
        /* DASHBOARD */
        'connect_coinbase': 'Connect Coinbase',
        'last_two_weeks': 'Max and Mix in last two weeks',
        /* SIGNIN */
        'signin_coinbase': 'SignIn with Coinbase',
        'signin_email_password': 'Or SignIn with your data',
        'signin': 'SignIn',
        'signin_error': 'Insert valid email and password',
        /* AUTH */
        'auth_msg_1': 'Loading...',
        'auth_msg_2': 'We are getting your data from Coinbase, please wait',
        'auth_msg_3': 'You will be redirected to Dashboard soon!',
        /* RULES */
        'create_new_rule': 'Create new Rule',
        'no_rules': 'No rule present, create one!',
        'wallet_with_currency': '[0] Wallet',
        'coinbase_fees': 'Coinbase fees',
        'fees_included': 'incluse',
        'fees_not_included': 'non incluse',
        'sell': 'sell',
        'buy': 'buy',
        'sell_you': 'sell',
        'buy_you': 'buy',
        'automatically': 'automatically',
        'just_notification': 'just notification',
        'run_rule_indefinitely': 'Run this rule indefinitely',
        'run_rule_once': 'Run this rule just once',
        'active': 'Active',
        'deactive': 'deactive',
        'no_active': 'NO Active',
        'n_executions': '[0] executions',
        'connect_rule': 'Connect Rule',
        'edit': 'Edit',
        'delete': 'Delete',
        'rule_description_fixed_price': 'If [0] price goes to [1] € or [2] [3] [4] [5]',
        'rule_description_variable_price': 'If [0] price goes [1] by [2] % compared to the price of the rule #[3], then [4] [5] [6]',
        'less': 'less',
        'more': 'more',
        'goes_up': 'up',
        'goes_down': 'down',
        'delete_rule': 'Delete Rule',
        'delete_rule_question': 'Do you want delete the following rule?',
        'delete_rule_and_rules_connected': 'If you delete the rule #[0], you will delete all rules connected as well:',
        'close': 'Close',
        /* RULES EDITOR*/
        'rule_name_label': 'Set a name, if you want (optional)',
        'rule_connect_rule_label': 'Do you want connect this new rule to an existing one? (optional)',
        'select_rule_label': 'Select a rule',
        'rule_wallet_label': 'Which wallet you want to use?',
        'select_wallet_label': 'Select a wallet',
        'rule_price_type_label': 'Are you interested about fixed or variable price?',
        'select_price_label': 'Select a price',
        'price_fixed': 'Fixed price',
        'price_variable': 'Variable price',
        'price_label': 'So, if price goes to',
        'price_Variable_label': 'So, if price goes to',
        'by': 'by',
        'compared_to_price': 'compared to the [0] price of the connected rule',
        'or': 'or',
        'per': 'per',
        'rule_action_label': 'Then, what you want to do? Buy or sell?',
        'choose': 'Choose',
        'which_currency': 'Which currency?',
        'rule_include_fees_label': 'Do you want include',
        'rule_include_fees_yes': 'Yes, I set price with included fees',
        'rule_include_fees_no': 'No, I set price without fees',
        'how_much': 'How much?',
        'rule_auto_label': 'Do you want allow Nostradamus to buy automatically, or you prefer to be just notified?',
        'rule_auto_yes': 'Yes, [0] automatically!',
        'rule_auto_no': 'No, just notify me!',
        'rule_loop_label': 'Do you want run this rule indefinitely or just once?',
        'rule_loop_yes': 'Yes, run this rule indefinitely',
        'rule_loop_no': 'No, run the rule just once',
        'reset': 'Reset',
        'save': 'Save',
        'create': 'Create',
        'purchase': 'Purchase',
        'sale': 'Sale',
        'buying': 'buying',
        'selling': 'selling',
        /* ACTIONS */
        'no_actions': 'No actions extecuted yet',
        'total': 'total',
        'purchased': 'purchased',
        'sold': 'sold',
        'equivalent_to': 'equivalent to',
        'spent': 'spent',
        'received': 'received',
        'rule_executed': 'Rule executed',
        'rule_was_deleted': 'this rule was deleted',
        /* SETTINGS */
        'wallet_type_label': 'Do you want use real or virtual wallet? The virtual wallet will just simulate the transactions.',
        'virtual_wallet': 'Virtual Wallet',
        'real_wallet': 'Real Wallet',
        'disconnect_wallet': 'Disconnect Coinbase Wallet',
        'disconnect_wallet_label': 'If you want disconnect a Coinbase wallet from NostradamusBot, select the wallet and click the button:',
        'disconnect_wallet_button': 'Disconnect the wallet',
        'disconnect_wallet_modal_msg': 'Do you want disconnect your [0] wallet from NostradamusBot?',
        'disconnect_wallet_modal_msg_all_rules': 'All rules related to this wallet will be deleted.',
        'disconnect_wallet_modal_msg_all_actions': 'All actions related to this wallet will be deleted.',
        'disconnect': 'disconnect',
        'delete_account': 'Delete Account',
        'delete_account_label': 'If you want delete your account from NostradamusBot, click the button and follow the instructions:',
        'delete_account_button': 'Delete My Account',
        'delete_account_modal_msg': 'Do you want delete your account from NostradamusBot?',
        /* FEES */
        'paid': 'paid',
        'unpaid': 'unpaid',
        'fee': 'commissione',
        'relative_to': 'Relative to',
        'action_executed': 'Action executed',
        'show_details': 'Show details',
        'hide_details': 'Hide details',
        'make_payment': 'Make payment',
        'select_payment_method': 'Select a payment method',
        'no_fees': 'No fees present',
        /* FOOTER */
        'privacy_policy': 'Privacy Policy'
      }
    };
  }

}
