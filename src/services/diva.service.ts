import { Diva, DivaClient } from '@sheencity/diva-sdk';
import { Adapter, CefAdapter, WebRtcAdapter } from '@sheencity/diva-sdk-core';

export class DivaService {
  #client?: DivaClient;
  adapter: WebRtcAdapter | CefAdapter;

  public get client() {
    if (!this.#client) new Error('diva client is not initialized');
    return this.#client;
  }

  /**
   * 初始话 webRtc 链接
   * @param container (HTMLDivElement) 视频加载的 dom 元素
   */
  public async init(container: HTMLDivElement) {
    console.log({ container });
    const apiKey = '<replace_your_api_key_here>';
    this.adapter = /Mars/.test(globalThis.navigator.userAgent)
      ? new CefAdapter(container) // 使用内嵌模式
      : new WebRtcAdapter(container, new URL('ws://127.0.0.1:3000')); // 使用云渲染模式
    const diva = new Diva({ apiKey, adapter: this.adapter });
    console.log('diva is', diva);
    this.#client = await diva.init();
    console.log('client is', this.#client);
  }
}
