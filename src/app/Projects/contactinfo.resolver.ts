import { Injectable } from "@angular/core";
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

enum queryFilterTypes {
  hid = "hid",
}

@Injectable({
  providedIn: "root",
})
export class ContactinfoResolver implements Resolve<any> {
  constructor(private http: HttpClient, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    rstate: RouterStateSnapshot
  ): Observable<any> {
    return this.http.get(
      environment.awlWebApiUrl +
        "/projects/" +
        route.params[queryFilterTypes.hid]
    );
  }
}
