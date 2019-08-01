package td.enterprise.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import sun.misc.BASE64Encoder;
import sun.security.rsa.RSAPublicKeyImpl;
import td.enterprise.config.Constants;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.inject.Inject;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPublicKey;

/**
 * Created by Yan on 2017/6/26.
 */
@Service("AccountService")
@Profile(Constants.SPRING_PROFILE_SAAS)
@Slf4j
public class AccountService {

    @Inject
    private RestTemplate restTemplate;

    @Value("${td-aacount-url}")
    private String tdAccountUrl;

    public boolean authorizeByTdppt(String tdppt) {

        String queryUrl = tdAccountUrl + "/api/v1/checkAuth";
        // create request body
        JSONObject request = new JSONObject();
        request.put("tdppt", tdppt);
        request.put("groupId", "9");

        // set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<String>(request.toString(), headers);

        // send request and parse result
        ResponseEntity<String> response = restTemplate
                .exchange(queryUrl, HttpMethod.POST, entity, String.class);
        return response.getStatusCode() == HttpStatus.OK;

    }

    public boolean authorizeByUserAndPwd(String email, String password) {
        String queryUrl = tdAccountUrl + "/api/v1/login";
        // create request body
        JSONObject request = new JSONObject();
        request.put("email", email);
        request.put("password", password);

        // set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<String>(request.toString(), headers);

        // send request and parse result
        ResponseEntity<String> response = restTemplate
                .exchange(queryUrl, HttpMethod.POST, entity, String.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            LoginResponse loginResponse = JSON.parseObject(response.getBody(), LoginResponse.class);
            if(loginResponse.getSuccess()){
                return true;
            }
        }
        return false;
    }

    private String rsaConvert(String password)  {
        // 1. 构造公钥
        String value = "8b6c944808b245a98794e77739f8de7135f59f7d3879d9bedca396f6428265434dc62549d1dd1aad87a94d9de80619979d3460f806501887307d15914184a9913e90e6a816b120027b9008bbec09a95fcd9cf38da535a7ece68d25a3884c4a0da3c02d22e4de8ad44f8a6b5d6c63b91c682925e1846ae043d0a848890f078a67";
        BigInteger n = new BigInteger(value, 16);
        BigInteger e = new BigInteger("10001", 16);
        String encoded = "";
        try {

            RSAPublicKey publicKey = new RSAPublicKeyImpl(n, e);

            // 2. 使用RSA算法
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);

            // 3. 对密码加密，rsa之后base64编码
            encoded = org.apache.commons.codec.binary.Base64.encodeBase64String(cipher.doFinal(password.getBytes()));
        }catch (Exception e1){
            log.error("RSA 加密出错: ", e1);
        }
        System.out.println("RSA加密后的密码：" + encoded);
        return  encoded;
    }
}

@Getter
@Setter
@ToString
class LoginResponse{
    private Boolean canViewFlag;
    private Boolean legalFlag;
    private Boolean success;
    private String user;
    private String tdppt;
}
