import { Component, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'signature-pad',
  templateUrl: './signature-pad.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignaturePadComponent),
      multi: true
    }
  ]
})
export class SignaturePadComponent implements ControlValueAccessor {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private signaturePad!: SignaturePad;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit() {
    this.init();
  }

  init() {
    this.signaturePad = new SignaturePad(this.canvasRef.nativeElement);
    this.signaturePad.onEnd = () => {
      this.onChange(this.signaturePad.toDataURL());
    };
  }

  writeValue(value: string): void {
    if (value) {
      this.signaturePad.fromDataURL(value);
    } else {
      this.signaturePad?.clear();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.signaturePad.off();
    } else {
      this.signaturePad?.on();
    }
  }

  save(): string {
    return this.signaturePad.toDataURL();
  }

  clear(): void {
    this.signaturePad.clear();
    this.onChange('');

  }

  isEmpty(): boolean {
    return this.signaturePad.isEmpty();
  }
}
