export class TimerHelper {
    static timer(ms: number){ 
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    static raceTimer(state: boolean, time?: number):Promise<boolean> {
        return new Promise(resolve => {
          setTimeout(() => resolve(state), time ? time : 1000);
        })
    }
}