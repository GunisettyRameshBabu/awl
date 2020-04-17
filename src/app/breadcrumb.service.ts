import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BreadcrumbService {
  public breadcrumbs: BehaviorSubject<
    { label: string; url: string }[]
  > = new BehaviorSubject([]);
  constructor() {}

  public addBreadCrumb(item: { label: string; url: string }) {
    let items = this.breadcrumbs.getValue();

    if (
      items.filter((x) => x.label == item.label || x.url == item.url).length ==
      0
    ) {
      this.breadcrumbs.next([...this.breadcrumbs.getValue(), item]);
    } else {
      const existingItem = items.filter(
        (x) => x.label == item.label || x.url == item.url
      )[0];
      let index = items.indexOf(existingItem);
      if (index < items.length - 1) {
        for (let i = items.length; i > index + 1; i--) {
          items.pop();
        }
        // if (item.url != existingItem.url) {
        //   items[index].url = item.url;
        // }
        this.breadcrumbs.next(items);
      } else {
        // if (item.url != existingItem.url) {
        //   items[index].url = item.url;
        // }
        this.breadcrumbs.next(items);
      }
    }
  }
}
