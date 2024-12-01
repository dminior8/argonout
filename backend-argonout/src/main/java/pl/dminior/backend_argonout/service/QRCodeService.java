package pl.dminior.backend_argonout.service;

import java.util.UUID;

public interface QRCodeService {
    byte[] generateQRCodeImage(UUID placeId) throws Exception;
}
