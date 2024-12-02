package pl.dminior.backend_argonout.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.dminior.backend_argonout.service.QRCodeService;

import java.util.UUID;

@RestController
@RequestMapping("/api/qrcode")
public class QRCodeController {

    private final QRCodeService qrCodeService;

    public QRCodeController(QRCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    @GetMapping("/generate/{placeId}")
    public ResponseEntity<byte[]> generateQRCode(@PathVariable UUID placeId) {
        try {
            byte[] qrCodeImage = qrCodeService.generateQRCodeImage(placeId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "image/png")
                    .body(qrCodeImage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
