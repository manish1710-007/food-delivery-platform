let ioInstance = null;

// WEBSOCKET SINGLETON REGISTRY


const setIo = (io) => { 
    ioInstance = io; 
    console.log("[SYS.NET] Real-time WebSocket Uplink Initialized.");
};

const getIo = () => {
    if (!ioInstance) {
        throw new Error("[SYS.FATAL] Socket.io module requested before initialization. Check Server.js boot sequence.");
    }
    return ioInstance;
};

module.exports = { setIo, getIo };