package BackEnd.Config;

import com.paypal.base.rest.APIContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class
PaypalConfig {

    @Value("AVrdGThy9xERBOV2RPpdFx2mYYc2e2Z_tC98M_L6cKBPtG-WfDxkmkgyAfUrEEsMh7B-xHXg30YShcVA")
    private String clientId;
    @Value("EF-F16KtR2f8nIi9di_WUFtbYPmGupQQfm68GuyGwNf4KuULatO2NEp1VBPrkh6K0zEwh2WAo5bGUFwZ")
    private String clientSecret;
    @Value("sandbox")
    private String mode;

    @Bean
    public APIContext apiContext(){
        return new APIContext(clientId,clientSecret,mode);
    }
}
