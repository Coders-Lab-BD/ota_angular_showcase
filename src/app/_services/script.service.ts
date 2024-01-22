import { Injectable } from '@angular/core';
interface Scripts {
  name: string;
  src: string;
}
export const ScriptStore: Scripts[] = [
  { name: 'jquery3', src: 'https://code.jquery.com/jquery-3.3.1.min.js' },
  { name: 'bKashLive', src: 'https://scripts.pay.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout.js' },
  { name: 'nagadSandBox', src: '' },
  { name: 'toastr', src: 'http://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.2/js/toastr.min.js' },
  { name: 'sweetalert', src: '//cdn.jsdelivr.net/npm/sweetalert2@11' },
  { name: 'core-min', src: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core-min.js' },
  { name: 'sha256', src: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/sha256.js' },
  { name: 'enc-base64', src: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/enc-base64.js' },
  { name: 'aes', src: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js' }
];
@Injectable({
  providedIn: 'root'
})
export class ScriptService
{
  private scripts: any = {};
  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      } else {
        // load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.onload = () => {
          this.scripts[name].loaded = true;
          console.log(`${name} Loaded.`);
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
