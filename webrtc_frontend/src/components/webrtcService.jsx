class PeerService {
    constructor() {
        if (!this.peer) {
            this.rtcConnection();
        }
    }

    rtcConnection() {
        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.services.mozilla.com",
                        "stun:stun1.1.google.com:19302"
                    ]
                }
            ],
        })
    }
    async getOffer() {
        if (this.peer) {
            const offer = await this.peer.createOffer();
            console.log(this.peer);
            console.log(offer);
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));//since when we are calling we know the local description hence we set it.
            return offer;
        }
    }

    async getAnswer(offer) {
        if (this.peer) {
            await this.peer.setRemoteDescription(offer);//we can set remote users on receivin offer
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));//we can set local and remote here because on receiving call we know the other peer description and local description
            return answer;
        }
    }

    async setRemoteDescriptionForlocal(answer) {
        if (this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }

    disconnectCall() {
        if (this.peer) {
            this.peer.close();
            this.peer = null;
        }
    }

    reconnectToPeer() {
        if (!this.peer) {
            return new PeerService();
        }
    }
}
export default new PeerService();