
import { Injectable } from '@angular/core';
import JSEncrypt from 'jsencrypt'

@Injectable({
    providedIn: "root"
})
export class NameService {
    public encodersa(text: any) {
        var pubkey =
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsvf99jKTMbrpis/C1fIOyOH3rlwLjoJQzGUFE+sKSg3qLfOpHJHANAGAxCuUAubYn557hm++I9hi9iS5RyZ30VOtMp6T5lZD64osJtwOzpfuC3acseytkI8fDpJJyKZgCbSsOh4RUQUab4wNEdtrrs1Dp5jlT7LtNGsqW9DVnYwIDAQAB';
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubkey); // pubkey是公钥内容
        var encrypted = encrypt.encrypt(text);
        return encrypted

    }
}