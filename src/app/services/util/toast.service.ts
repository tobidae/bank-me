import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  duration = 5000;

  constructor(private toastr: ToastrService) {
  }

  response(type, message, title?, duration = this.duration) {
    this[type](message, title, parseInt(duration.toString(), 10));
  }

  success(message, title?, duration = this.duration) {
    this.toastr.success(message, title, {
      timeOut: duration,
      extendedTimeOut: duration / 2
    });
  }

  error(message, title?, duration = this.duration) {
    this.toastr.error(message, title, {
      timeOut: duration,
      extendedTimeOut: duration / 2
    });
  }

  warning(message, title?, duration = this.duration) {
    this.toastr.warning(message, title, {
      timeOut: duration,
      extendedTimeOut: duration / 2
    });
  }

  info(message, title?, duration = this.duration) {
    this.toastr.info(message, title, {
      timeOut: duration,
      extendedTimeOut: duration / 2
    });
  }

  show(message, title?, duration = this.duration) {
    this.toastr.show(message, title, {
      timeOut: duration,
      extendedTimeOut: duration / 2
    });
  }
}
