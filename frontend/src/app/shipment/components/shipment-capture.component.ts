import {Component, Output, OnInit, EventEmitter, Input, DoCheck} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {CustomerService} from "../../customer/api/customer.service";
import {CustomerResource} from "../../customer/api/resources/customer.resource";
import {Router} from "@angular/router";
import {ShipmentResource} from "../api/resources/shipment.resource";
import {ShipmentService} from "../api/shipment.service";
import {ShipmentCargo} from "../api/datastructures/cargo.datastructure";
import {ShipmentServices} from "../api/datastructures/services.datastructure";
import {EditorMode} from "../../common/ui/enums/editor-mode.enum";

@Component({
    selector: "educama-shipment-capture",
    templateUrl: "shipment-capture.component.html"
})
export class ShipmentCaptureComponent implements OnInit, DoCheck {

    @Input()
    public shipment: ShipmentResource;

    @Output()
    public createShipmentCancellationEvent = new EventEmitter();

    public shipmentCaptureForm: FormGroup;
    public customerSuggestions: CustomerResource[];

    public senderStreet: string;
    public senderStreetNo: string;
    public senderZipCode: string;
    public senderCity: string;
    public senderUUID: string;

    public receiverStreet: string;
    public receiverStreetNo: string;
    public receiverZipCode: string;
    public receiverCity: string;
    public receiverUUID: string;

    public dangerousCheck: boolean = false;
    public exportInsuranceCheck: boolean = false;
    public exportClearanceCheck: boolean = false;
    public preCarriageCheck: boolean = false;
    public flightCheck: boolean = true;
    public onCarriageCheck: boolean = false;
    public importInsuranceCheck: boolean = false;
    public importClearanceCheck: boolean = false;
    public senderIsCustomerCheck: boolean = false;
    public receiverIsCustomerCheck: boolean = false;
    public customerTypeEnum: string = "SENDER";

    public editorMode: EditorMode;
    private _isInitialized:boolean = false;

    constructor(private _formBuilder: FormBuilder,
                private _customerService: CustomerService,
                private _router: Router,
                private _shipmentService: ShipmentService) {
    }

    public ngOnInit() {
        this.shipmentCaptureForm = this._formBuilder.group({
            sender: ["", [Validators.required]],
            receiver: ["", [Validators.required]],
            numberPackages: ["", [Validators.pattern("[0-9]+")]],
            totalWeight: ["", [Validators.pattern("[0-9]+")]],
            totalCapacity: ["", [Validators.pattern("[0-9]+")]],
            cargoDescription: [""],
            dangerousGoods: [""],
            preCarriage: [""],
            exportInsurance: [""],
            exportCustomsClearance: [""],
            flight: [""],
            importInsurance: [""],
            importCustomsClearance: [""],
            onCarriage: [""],
            customerTypeEnum: [""],
        });
    }

    public ngDoCheck() {

        // Determine editor mode based on existence of a passed in customer
        this.editorMode = this.shipment ? EditorMode.update : EditorMode.create;

        if (this.editorMode === EditorMode.update && !this._isInitialized) {
            this.shipmentCaptureForm.get("sender").setValue(this.shipment.sender.name);
            this.shipmentCaptureForm.get("receiver").setValue(this.shipment.receiver.name);
            this.shipmentCaptureForm.get("numberPackages").setValue(this.shipment.shipmentCargo.numberPackages);
            this.shipmentCaptureForm.get("totalWeight").setValue(this.shipment.shipmentCargo.numberPackages);
            this.shipmentCaptureForm.get("totalCapacity").setValue(this.shipment.shipmentCargo.totalCapacity);
            this.shipmentCaptureForm.get("dangerousGoods").setValue(this.shipment.shipmentCargo.dangerousGoods);
            this.shipmentCaptureForm.get("preCarriage").setValue(this.shipment.shipmentServices.preCarriage);
            this.shipmentCaptureForm.get("exportInsurance").setValue(this.shipment.shipmentServices.exportInsurance);
            this.shipmentCaptureForm.get("exportCustomsClearance").setValue(this.shipment.shipmentServices.exportCustomsClearance);
            this.shipmentCaptureForm.get("flight").setValue(this.shipment.shipmentServices.flight);
            this.shipmentCaptureForm.get("importInsurance").setValue(this.shipment.shipmentServices.importInsurance);
            this.shipmentCaptureForm.get("importCustomsClearance").setValue(this.shipment.shipmentServices.importCustomsClearance);
            this.shipmentCaptureForm.get("onCarriage").setValue(this.shipment.shipmentServices.onCarriage);
            this.shipmentCaptureForm.get("customerTypeEnum").setValue(this.shipment.customerTypeEnum);
            this._isInitialized = true;
        }
    }

    // ***************************************************
    // Event Handler
    // ***************************************************

    public loadUserSuggestions(event: any) {
        this._customerService.findCustomerSuggestions(event.query)
            .subscribe(customerSuggestionResource => this.customerSuggestions = customerSuggestionResource.customers);
    }

    public createNewCustomer() {
        this._router.navigate(["/customers/capture"]);
    }

    public onReceiverSelected(receiver: CustomerResource) {

        this.receiverStreet = receiver.address.street;
        this.receiverStreetNo = receiver.address.streetNo;
        this.receiverZipCode = receiver.address.zipCode;
        this.receiverCity = receiver.address.city;
        this.receiverUUID = receiver.uuid;
    }

    public onSenderSelected(sender: CustomerResource) {

        this.senderStreet = sender.address.street;
        this.senderStreetNo = sender.address.streetNo;
        this.senderZipCode = sender.address.zipCode;
        this.senderCity = sender.address.city;
        this.senderUUID = sender.uuid
    }

    public cancel() {
        this.shipmentCaptureForm.reset();
        this.createShipmentCancellationEvent.emit(null);
    }

    public createShipment() {

        let shipment = new ShipmentResource();

        let shipmentCargo = new ShipmentCargo(
            this.shipmentCaptureForm.get("cargoDescription").value,
            this.shipmentCaptureForm.get("totalWeight").value,
            this.shipmentCaptureForm.get("totalCapacity").value,
            this.shipmentCaptureForm.get("dangerousGoods").value,
            this.shipmentCaptureForm.get("numberPackages").value,
        );

        let shipmentServices = new ShipmentServices(
            this.shipmentCaptureForm.get("preCarriage").value,
            this.shipmentCaptureForm.get("exportInsurance").value,
            this.shipmentCaptureForm.get("exportCustomsClearance").value,
            this.shipmentCaptureForm.get("flight").value,
            this.shipmentCaptureForm.get("importInsurance").value,
            this.shipmentCaptureForm.get("importCustomsClearance").value,
            this.shipmentCaptureForm.get("onCarriage").value
        );

        shipment.shipmentCargo = shipmentCargo;
        shipment.shipmentServices = shipmentServices;
        shipment.customerTypeEnum = this.shipmentCaptureForm.get("customerTypeEnum").value;
        shipment.uuidSender = this.senderUUID;
        shipment.uuidReceiver = this.receiverUUID;

        this._shipmentService.createShipment(shipment).subscribe(shipment => {
            this._router.navigate(["/shipments"]);
        });

    }
}