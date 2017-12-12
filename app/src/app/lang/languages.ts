export class Languages {

  public static get languages(): Object {
    return {
      'it': {
        'signout': 'Esci',
        'dashboard': 'Dashboard',
        'rules': 'Regole',
        'actions': 'Azioni',
        'settings': 'Impostazioni',
        'virtual_wallet_alert': 'Stai utilizzando il portafoglio virtuale. Le tue azioni saranno semplicemente simulate.',
        'virtual_wallet_alert_link': 'Clicca qui per cambiare questa impostazione',
      },
      'en': {
        'signout': 'SignOut',
        'dashboard': 'Dashboard',
        'rules': 'Rules',
        'actions': 'Actions',
        'settings': 'Settings',
        'virtual_wallet_alert': 'You are using the virtual wallet. Your actions will be just simulated',
        'virtual_wallet_alert_link': 'Click here to change this setting.',
      }
    };
  }

}
