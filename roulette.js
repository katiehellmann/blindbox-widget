let fieldData; //json file

const frogSize = 200;
let timeout;

const mainContainer = document.getElementById('roulette-container');
const frog = document.getElementById('frog');
const sound = document.getElementById('sound');

//check the type of chatter
const checkPrivileges = (data, privileges) => {
    const {tags, userId} = data;
    const {mod, subscriber, badges} = tags;
    const required = privileges || fieldData.privileges;
    const isMod = parseInt(mod);
    const isSub = parseInt(subscriber);
    const isVip = (badges.indexOf("vip") !== -1);
    const isBroadcaster = (userId === tags['room-id']);
    if (isBroadcaster) return true;
    if (required === "justSubs" && isSub) return true;
    if (required === "mods" && isMod) return true;
    if (required === "vips" && (isMod || isVip)) return true;
    if (required === "subs" && (isMod || isVip || isSub)) return true;
    return required === "everybody";
};

//hide the image
const hide = () => {
    frog.className = 'frog hidden';
};

//show frog
const dofrog = () => {
    if(timeout){
        clearTimeout(timeout);
        timeout = undefined;
    }
    hide();
    const {height, width} = mainContainer.getBoundingClientRect();
    frog.style.top = `${Math.random() * (height - frogSize)}px`;
    frog.style.left = `${Math.random() * (width - frogSize)}px`;
    frog.className = 'frog';
    sound.play();
    //hide after 10 seconds
    timeout = setTimeout(() => {
        hide();
    }, 10000);
};

const handleMessage = (obj) => {
    const frogCommand = fieldData.frogCommand;
    const data = obj.detail.event.data;
    const {text} = data;
    const textStartsWithCommand = text.startsWith(frogCommand);
    //only run command if the user has permissions or the message includes the !...
    if(!textStartsWithCommand || !checkPrivileges(data)){
        return;
    }
    dofrog();
};

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") {
        return;
    }
    handleMessage(obj);
});

//get data from json
window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
});
