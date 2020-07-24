import { Injectable } from '@angular/core';
import {Observable, of, Subscriber, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {Logger} from "./logger.service";

export interface Script {
  name: string;
  src: string;
}

interface ScriptListener {
  name: string;
  subscriber: Subscriber<string>;
}

const Scripts: {[key: string]: Script} = {
  google_map : {
    name: 'google_map',
    src: `https://maps.googleapis.com/maps/api/js?key=${environment.google_map_key}`
  },
  web_chat : {
    name: 'web_chat',
    src: 'https://cdn.botframework.com/botframework-webchat/latest/webchat-minimal.js'
  }
}

@Injectable({
  providedIn: 'root'
})
export class JsLoaderService {

  private loading: Set<string> = new Set();
  private loaded: Set<string> = new Set();
  private listeners: ScriptListener[] = [];
  private loadSubscriber: Subscriber<string>;

  public load(script: string): Observable<string> {
    const scriptInfo = Scripts[script];
    if (typeof scriptInfo === 'undefined') {
      return throwError('Unknown script');
    }

    if (this.loaded.has(script)) {
      return of(script);
    }

    if (!this.loading.has(script)) {
      this.loading.add(script);
      this.loadScript(scriptInfo)
    }

    return new Observable<string>(subscriber => {
      this.listeners.push({name: script, subscriber})
    })
  }

  private loadScript(script: Script) {
    let scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = script.src;
    scriptElement.async = true;

    scriptElement.onload = () => {
      this.loadSubscriber.next(script.name);
    };

    scriptElement.onerror = (error: any) => {
      this.logger.log('Load script failed: ', error)
      this.loadSubscriber.error({script, error});
    };

    document.getElementsByTagName('body')[0].appendChild(scriptElement);
  }

  constructor(private logger: Logger) {
    new Observable<string>(subscriber => this.loadSubscriber = subscriber).subscribe({
      next: script => {
      // not loading, loaded
      this.loaded.add(script);
      this.loading.delete(script);
      // complete waiting subscribers, and remove from listen list
      this.listeners.filter(listener => listener.name === script)
        .forEach(listener => {
          listener.subscriber.next(script);
          listener.subscriber.complete();
        });
      this.listeners = this.listeners.filter(listener => listener.name !== script);
      },
    error: error => {
      // not loading, not loaded
      this.loading.delete(error.script);
      // error and complete waiting subscribers, and remove from listen list
      this.listeners.filter(listener => listener.name === error.script)
        .forEach(listener => {
          listener.subscriber.error(error);
          listener.subscriber.complete();
        });
      this.listeners = this.listeners.filter(listener => listener.name !== error.script);
    }})
  }
}
