import java.net.*;

public class DNSInfo {
    public static void main(String[] args) throws Exception {
        System.out.println(System.getProperty("java.version"));
        System.out.println(InetAddress.getByName("dl.google.com"));
        System.out.println(InetAddress.getByName("repo.maven.apache.org"));
    }
}
