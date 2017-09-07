export class EnabledTaskListModel {
    public enabledTaskList: EnabledTaskListRowModel[];
}

export class EnabledTaskListRowModel {
    public trackingId: string;
    public name: string;
    public description: string;
    public senderAddress: string;
    public receiverAddress: string;

    constructor(trackingId: string,
                name: string,
                description: string,
                senderAddress: string,
                receiverAddress: string) {
        this.trackingId = trackingId;
        this.name = name;
        this.description = description;
        this.senderAddress = senderAddress;
        this.receiverAddress = receiverAddress;
    }
}
