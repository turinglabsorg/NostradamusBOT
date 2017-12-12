export class Languages {

  public static get languages(): Object {
    return {
      'it': {
        /* NAVBAR */
        'signout': 'Esci',
        'dashboard': 'Dashboard',
        'rules': 'Regole',
        'actions': 'Azioni',
        'fees': 'Commissioni',
        'settings': 'Impostazioni',
        'virtual_wallet_alert': 'Stai utilizzando il portafoglio virtuale. Le tue azioni saranno semplicemente simulate.',
        'virtual_wallet_alert_link': 'Clicca qui per cambiare questa impostazione',
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
    // {{langService.getString('price_fixed')}}
      },
      'en': {
        /* NAVBAR */
        'signout': 'SignOut',
        'dashboard': 'Dashboard',
        'rules': 'Rules',
        'actions': 'Actions',
        'fees': 'Fees',
        'settings': 'Settings',
        'virtual_wallet_alert': 'You are using the virtual wallet. Your actions will be just simulated',
        'virtual_wallet_alert_link': 'Click here to change this setting.',
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
      }
    };
  }

}
