export class ResBody<T> {
    error : {
        message : string
    };
    data : T

    setErrorMsg(msg : string){
        if (!this.error) {
            this.error = { message: "" };
        }
        this.error.message = msg;
    }
    ToString(): string {
        if(this.data) {
            return JSON.stringify(this)
        }
        if(this.error.message)
            return JSON.stringify(this)
        return ""
    }
}