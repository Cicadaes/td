import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class UploadImagesService {
    
    constructor(private http: HttpClient) {
    }

}