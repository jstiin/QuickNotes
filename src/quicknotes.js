const AccentColors = require("windows-accent-colors");
const fs = require("fs");
const os = require("os");

function file() {
    const date = new Date();
    const name = `note_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.txt`;
    const homedir = os.homedir();
    const docPath = `${homedir}/Documents/`;
    const filePath = `${docPath}/QuickNotes/`;
    const NOTIFICATION_TITLE = 'Noted.';
    const NOTIFICATION_BODY = `Note saved to ${filePath}${name}`;


    if (!fs.existsSync(`${filePath}`)) {
        fs.mkdirSync(`${filePath}`);
    }

    try {
        let text = document.getElementById('noteArea').value;

        fs.writeFileSync(`${filePath}${name}`, text);
        document.getElementById('noteArea').value = '';

        if (Notification.permission === "granted") {
            new Notification(`${NOTIFICATION_TITLE}`, {
                body: `${NOTIFICATION_BODY}`,
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(`${NOTIFICATION_TITLE}`, {
                        body: `${NOTIFICATION_BODY}`,
                    });
                }
            });
        }

        document.getElementById('noteArea').focus();

    } catch (err) {
        console.error(err);
    }
}


function getAndsetAccentColor() {

    const colors = AccentColors.getAccentColors();
    document.documentElement.style.setProperty('--accent-color', colors.accent.hex);

}

getAndsetAccentColor();




