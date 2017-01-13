const electron = require('electron');
const path = require('path');
const app = electron.app;
let tray = null;

exports.create = function(mainWindow) {
  if (process.platform === 'darwin' || tray) {
    return;
  }

  const iconPath = path.join(__dirname, '/public/images/batcave_small.png');

  const toggleWin = function(){
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  };

  const contextMenu = electron.Menu.buildFromTemplate([
    {
      label: 'Restore Batcave',
      click() {
        toggleWin();
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click() {
        app.quit();
      }
    }
  ]);

  tray = new electron.Tray(iconPath);
  tray.setToolTip('Batcave');
  tray.setContextMenu(contextMenu);
  tray.on('click', toggleWin);
};
