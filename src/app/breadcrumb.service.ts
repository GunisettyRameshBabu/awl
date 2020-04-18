import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BreadcrumbService {
  public breadcrumbs: BehaviorSubject<
    { label: string; url: string; queryParams?: any }[]
  > = new BehaviorSubject([]);
  constructor() {}

  public addBreadCrumb(item: {
    label: string;
    url: string;
    queryParams?: any;
  }) {
    let items = this.breadcrumbs.getValue();
    if (items.length == 0 && item.label != "Home") {
      this.breadcrumbs.next([{ url: "", label: "Home" }, item]);
    } else if (
      items.filter((x) => x.label == item.label || x.url == item.url).length ==
      0
    ) {
      this.breadcrumbs.next([...this.breadcrumbs.getValue(), item]);
    } else {
      const existingItem = items.filter(
        (x) => x.label == item.label || x.url == item.url
      )[0];
      const index = items.indexOf(existingItem);
      if (index < items.length - 1) {
        for (let i = items.length; i > index + 1; i--) {
          items.pop();
        }
        if (
          item.url != existingItem.url ||
          item.queryParams != existingItem.queryParams
        ) {
          items[index].url = item.url;
          items[index].queryParams = item.queryParams;
        }
        this.breadcrumbs.next(items);
      } else {
        if (
          item.url != existingItem.url ||
          item.queryParams != existingItem.queryParams
        ) {
          items[index].url = item.url;
          items[index].queryParams = item.queryParams;
        }
        this.breadcrumbs.next(items);
      }
    }
  }
}
