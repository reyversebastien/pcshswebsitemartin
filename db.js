

class PCDatabase {
    constructor() {
        
        
        this.useFirebase = true;
        this.fs = null;
        
        if (window._PCSHS_FIREBASE_INIT && typeof firebase !== 'undefined') {
            try {
                this.fs = firebase.firestore();
                console.log('%c✅ Firestore enabled for real-time sync', 'color:#FF6D00;font-weight:bold;font-size:12px;');
            } catch (e) {
                console.warn('Firestore init failed, using localStorage fallback', e.message);
                this.useFirebase = false;
            }
        }
    }

    
    _key(col) { return 'pcshs_' + col; }
    _lsGet(col) {
        try {
            const data = JSON.parse(localStorage.getItem(this._key(col)));
            return Array.isArray(data) ? data : [];
        } catch { return []; }
    }
    _lsSet(col, d) { localStorage.setItem(this._key(col), JSON.stringify(d)); }
    _genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

    genRef(prefix = 'PCSHS') {
        return `${prefix}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    
    async save(col, data) {
        const doc = { ...data, id: data.id || this._genId(), _at: new Date().toISOString() };
        let fsSuccess = false;
        if (this.useFirebase && this.fs) {
            try {
                await this.fs.collection(col).doc(doc.id).set(doc, { merge: true });
                fsSuccess = true;
            } catch (e) {
                console.warn('Firebase save failed, falling back to localStorage. Error:', e.message);
            }
        }

        
        const all = this._lsGet(col);
        const i = all.findIndex(x => x.id === doc.id);
        i > -1 ? all[i] = doc : all.unshift(doc);
        this._lsSet(col, all);

        return doc;
    }

    
    async getAll(col, where = null) {
        if (this.useFirebase && this.fs) {
            try {
                let q = this.fs.collection(col).orderBy('_at', 'desc');
                if (where) q = q.where(where[0], where[1], where[2]);
                const snap = await q.get();
                return snap.docs.map(d => d.data());
            } catch (e) {
                console.warn('Firebase read failed, returning localStorage data. Error:', e.message);
            }
        }
        
        let data = this._lsGet(col);
        if (where) {
            const [f, op, v] = where;
            if (op === '==') data = data.filter(d => d[f] === v);
            if (op === '!=') data = data.filter(d => d[f] !== v);
        }
        return data;
    }

    
    async getById(col, id) {
        if (this.useFirebase && this.fs) {
            try {
                const doc = await this.fs.collection(col).doc(id).get();
                if (doc.exists) return doc.data();
            } catch (e) {
                console.warn('Firebase get fails, falling back locally.', e.message);
            }
        }
        return this._lsGet(col).find(x => x.id === id) || null;
    }

    
    async findOne(col, field, value) {
        const all = await this.getAll(col, [field, '==', value]);
        return all[0] || null;
    }

    
    async delete(col, id) {
        if (this.useFirebase && this.fs) {
            try {
                await this.fs.collection(col).doc(id).delete();
            } catch (e) {
                console.warn('Firebase delete fails, falling back locally.', e.message);
            }
        }
        this._lsSet(col, this._lsGet(col).filter(x => x.id !== id));
    }

    
    async setStatus(col, id, status, note = '') {
        const existing = await this.getById(col, id);
        if (!existing) throw new Error('Record not found');
        return this.save(col, { ...existing, status, statusNote: note, statusUpdated: new Date().toISOString() });
    }

    
    async count(col) {
        return (await this.getAll(col)).length;
    }

    
    onSnapshot(col, callback, pollMs = 5000) {
        if (this.useFirebase && this.fs) {
            try {
                return this.fs.collection(col).orderBy('_at', 'desc').onSnapshot(snap => {
                    callback(snap.docs.map(d => d.data()));
                }, error => {
                    console.warn('Firebase listener fails, falling back to polling.');
                    callback(this._lsGet(col));
                    const interval = setInterval(() => callback(this._lsGet(col)), pollMs);
                    return () => clearInterval(interval);
                });
            } catch (e) {
                
            }
        }
        callback(this._lsGet(col));
        const interval = setInterval(() => callback(this._lsGet(col)), pollMs);
        return () => clearInterval(interval);
    }
}

window.DB = new PCDatabase();
console.log('%cPCSHS DB ready. Mode: ' + (window.DB.useFirebase ? 'Firebase' : 'localStorage'),
    'color:#0038A8;font-weight:bold');
