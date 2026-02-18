declare class CompradorDto {
    email: string;
    nome: string;
}
declare class DataDto {
    transacao_id: string;
    comprador: CompradorDto;
    produtos_comprados?: Array<{
        produto_id: string;
    }>;
}
export declare class WebhookCheckoutDto {
    event: string;
    produto_id?: string;
    data: DataDto;
}
export {};
