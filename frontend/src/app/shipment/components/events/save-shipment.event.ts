import {ShipmentCargo} from "../../api/datastructures/cargo.datastructure";
import {Party} from "../../api/datastructures/party.datastructure";
import {ShipmentServices} from "../../api/datastructures/services.datastructure";

export class SaveShipmentEvent {

    trackingId: string;
    uuidSender: string;
    uuidReceiver: string;
    sender: Party;
    receiver: Party;
    customerTypeEnum: string;
    shipmentCargo: ShipmentCargo;
    shipmentServices: ShipmentServices;

    constructor(trackingId: string, uuidSender: string, uuidReceiver: string, sender: Party, receiver: Party, customerTypeEnum: string, shipmentCargo: ShipmentCargo, shipmentServices: ShipmentServices) {
        this.trackingId = trackingId;
        this.uuidSender = uuidSender;
        this.uuidReceiver = uuidReceiver;
        this.sender = sender;
        this.receiver = receiver;
        this.customerTypeEnum = customerTypeEnum;
        this.shipmentCargo = shipmentCargo;
        this. shipmentServices = shipmentServices;
    }
}