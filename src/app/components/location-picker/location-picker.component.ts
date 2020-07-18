import {Component, ElementRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LocationPickerResolverService} from "./location-picker-resolver.service";
import {fromEvent, Observable} from "rxjs";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.styl']
})
export class LocationPickerComponent implements OnInit {

  @ViewChild('wrapper') wrapper: ElementRef<HTMLElement>;

  loading: boolean = true;
  loaded: boolean = false;
  @Input() zoom: number = 4;
  @Input('position') markerPosition: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  @Input() center?: google.maps.LatLngLiteral = null;
  @Input() height: number = 500;
  @Input() picking: boolean = false;
  @Input() radius: number = 100;
  @Input() showRadius: boolean = true;

  options: google.maps.MapOptions = {
    clickableIcons: false,
    gestureHandling: "cooperative",
    streetViewControl: false,
  }

  circleOptions: google.maps.CircleOptions = {
    fillColor: '#1E88E5',
    strokeColor: '#1E88E5',
    strokeWeight: 2,
    fillOpacity: 0.3,
    strokeOpacity: 0.9
  }

  setMarker(event: google.maps.MouseEvent) {
    if (!this.picking) {
      return
    }

    this.markerPosition = event.latLng.toJSON();
  }

  initParams() {
    if (!this.center) {
      this.center = this.markerPosition;
    }
  }

  constructor(private resolver: LocationPickerResolverService) { }

  ngOnInit(): void {
    // We are not a component used in router so we can't rely on router to load script
    // this.route.data.subscribe((data: {loaded: boolean}) => {
    //   this.loaded = data.loaded;
    //   this.loading = false;
    // });
    (this.resolver.resolve() as Observable<boolean>).subscribe(loaded => {
      this.initParams();
      this.loaded = loaded;
      this.loading = false;
    })
  }

}
