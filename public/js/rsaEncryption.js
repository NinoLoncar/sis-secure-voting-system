class RSAEncrypter {
    keyUrl = 'http://localhost:12000/rsa-public-key';

    async encrypt(data) {
        const base64Key = await this.getKey();
        const publicKey = await this.importRSAPublicKey(base64Key);
        const encodedData = new TextEncoder().encode(data);
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            publicKey,
            encodedData
        );
        return this.arrayBufferToBase64(encryptedData);
    }

    async getKey() {
        const response = await fetch(this.keyUrl);
        const data = await response.json();
        return data.key;
    }

    base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let byte of bytes) {
            binary += String.fromCharCode(byte);
        }
        return btoa(binary);
    }

    async importRSAPublicKey(base64Key) {
        const keyBuffer = this.base64ToArrayBuffer(base64Key);
        return await crypto.subtle.importKey(
            'spki',
            keyBuffer,
            {
                name: 'RSA-OAEP',
                hash: { name: 'SHA-1' },
            },
            true,
            ['encrypt']
        );
    }
}