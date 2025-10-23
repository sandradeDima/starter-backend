export class MensajeApi {
    code: number;
    error: boolean;
    message: string;
    technicalMessage?: string | undefined;
    data?: any;

    constructor(init?: Partial<MensajeApi>) {
        this.code = init?.code ?? 200;
        this.error = init?.error ?? false;
        this.message = init?.message ?? '';
        this.technicalMessage = init?.technicalMessage ?? undefined;
        this.data = init?.data;
    }
}
