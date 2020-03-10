import { Injectable } from '@angular/core';
import { Observable, config } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';

@Injectable({    
providedIn:'root'
})
export class ApiService {
    masterdataService: any;
    

constructor(private http: HttpClient,private route: ActivatedRoute){ }

getProjects(config): Observable<any>{        
    return this.http.get('api/projects/' + config);        
 }    
getProject(hid:string):Observable<any>{        
return this.http.get('api/projects'+hid);                              
}    
getApplications(hid:string,config:string):Observable<any>{         
return this.http.get('api/projects'+hid +'/applications'+config);                            
}    
getApplication(hid:string,config:string):Observable<any>{        
return this.http.get('api/projects'+hid +'/application'+config);                           
}    
findApplicant(hid:string,config:string){         
return this.http.get('api/projects'+hid+'/applications'+config);                            
}    
getWaitingList(hid:string,applicationNumber:number){        
return this.http.get('api/projects'+ hid + '/applications/'+ applicationNumber +'/position'); 
    }           
 }


