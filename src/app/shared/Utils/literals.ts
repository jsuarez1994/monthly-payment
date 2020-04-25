// TRANSLATE
import { TranslateService } from '@ngx-translate/core';

export class Literals {
  constructor(private translate: TranslateService) {}

  getLiterals(literals: string[]): Map<string, string> {
    let mapResult: Map<string, string> = new Map<string, string>();

    literals.forEach((literal) => {
      this.translate.get(literal).subscribe((data) => {
        mapResult.set(literal, data);
      });
    });
    return mapResult;
  }
}
