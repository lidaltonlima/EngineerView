import { BrowserWindow, dialog, MenuItem, MenuItemConstructorOptions } from 'electron'

export const menuBarTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open file',
        accelerator: 'Ctrl+O',
        click: () => {
          dialog
            .showOpenDialog({
              properties: ['openFile'],
              filters: [
                {
                  name: 'JSON Files',
                  extensions: ['json']
                }
              ]
            })
            .then((result) => {
              const focusedWin = BrowserWindow.getFocusedWindow()
              focusedWin?.webContents.send('open-file', result)
            })
            .catch((error) => {
              console.log(error)
            })
        }
      },
      {
        label: 'Exit',
        role: 'quit'
      }
    ]
  }
]
