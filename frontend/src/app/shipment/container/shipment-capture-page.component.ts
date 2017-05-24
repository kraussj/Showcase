import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {ErrorService} from "../../common/error/services/error.service";
import {ShipmentService} from "../api/shipment.service";
import {ShipmentResource} from "../api/resources/shipment.resource";
import {SaveShipmentEvent} from "../components/events/save-shipment.event";
import {State} from "../../app.reducers";
import * as actions from "../reducer/shipment-capture-page.actions";
import {Observable, Subscription} from "rxjs";
import {ShipmentCaptureSlice} from "../reducer/shipment-capture-page.reducer";
import {ShipmentCapturePageModel} from "./shipment-capture-page.model";
import * as _ from "lodash";

@Component({
    selector: "educama-shipment-capture-page",
    templateUrl: "shipment-capture-page.component.html"
})
export class ShipmentCapturePageComponent implements OnInit, OnDestroy {

    // relevant slice of store and subscription for this slice
    public shipmentCaptureSlice: Observable<ShipmentCaptureSlice>;
    public shipmentCaptureSliceSubscription: Subscription;

    // model for the page
    public shipmentCaptureModel: ShipmentCapturePageModel = new ShipmentCapturePageModel();

    constructor(private _activatedRoute: ActivatedRoute,
                private _errorService: ErrorService,
                private _shipmentService: ShipmentService,
                private _router: Router,
                private _store: Store<State>) {

        this.shipmentCaptureSlice = this._store.select(state => state.shipmentCaptureSlice);

        this.shipmentCaptureSliceSubscription = this.shipmentCaptureSlice.subscribe(
            shipmentCaptureSlice => this.updateShipmentCaptureModel(shipmentCaptureSlice)
        );
    }

    public ngOnInit() {
        this._activatedRoute.params.subscribe(params => {
            if (params["id"] && params["id"] !== "capture") {
                this.loadShipment(params["id"]);
            }
        });
    }

    public ngOnDestroy() {
        this._store.dispatch(new actions.ResetShipmentCaptureSliceAction(""));
        this.shipmentCaptureSliceSubscription.unsubscribe();
    }

    // ***************************************************
    // Event Handler
    // ***************************************************

    /*
     * Handles the save event for a shipment
     */
    public onSaveShipmentEvent(saveShipmentEvent: SaveShipmentEvent) {
        if (_.isUndefined(this.shipmentCaptureModel.shipment)) {
            this._shipmentService.createShipment(this.mapShipmentFromSaveShipmentEvent(saveShipmentEvent))
                .subscribe(shipment => {
                    this._router.navigate(["/shipment"]);
                })
        }
        else {
            this._shipmentService.updateShipment(saveShipmentEvent.trackingId, this.mapShipmentFromSaveShipmentEvent(saveShipmentEvent))
                .subscribe(shipment => {
                    this._router.navigate(["/shipment"]);
                })
        }
    }

    /*
     * Handles the cancellation of a new shipment creation
     */
    public onSaveShipmentCancellationEvent(saveShipmentEvent: SaveShipmentEvent) {
        this._router.navigate(["/shipment"]);
    }

    /*
     * Handles the error events from components
     */
    public onSaveEvent(errorMessage: string) {
        this._errorService.showError(errorMessage);
    }

    // ***************************************************
    // Data Retrieval
    // ***************************************************

    private loadShipment(uuid: string) {
        this._shipmentService.findShipmentById(uuid).subscribe(
            shipment => {
                this._store.dispatch(new actions.LoadShipmentAction(shipment));
            }
        );
    }

    private updateShipmentCaptureModel(shipmentCaptureSlice:ShipmentCaptureSlice) {
        this.shipmentCaptureModel.shipment = shipmentCaptureSlice.shipment;
    }

    private mapShipmentFromSaveShipmentEvent(saveShipmentEvent: SaveShipmentEvent): ShipmentResource {
        let shipment = new ShipmentResource();
        shipment.trackingId = saveShipmentEvent.trackingId;
        shipment.uuidSender = saveShipmentEvent.uuidSender;
        shipment.uuidReceiver = saveShipmentEvent.uuidReceiver;
        shipment.sender = saveShipmentEvent.sender;
        shipment.receiver = saveShipmentEvent.receiver;
        shipment.customerTypeEnum = saveShipmentEvent.customerTypeEnum;
        shipment.shipmentCargo = saveShipmentEvent.shipmentCargo;
        shipment. shipmentServices = saveShipmentEvent.shipmentServices;
        return shipment;
    }

}
