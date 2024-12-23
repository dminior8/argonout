package pl.dminior.backend_argonout.service;

import com.google.zxing.MultiFormatWriter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.UUID;

class QRCodeServiceImplTest {

    private QRCodeServiceImpl qrCodeService;

    @BeforeEach
    void setUp() {
        qrCodeService = new QRCodeServiceImpl();
    }

    @Test
    void generateQRCodeImage_shouldReturnNonEmptyByteArray() throws Exception {
        UUID placeId = UUID.randomUUID();  // Given
        byte[] result = qrCodeService.generateQRCodeImage(placeId);  // When
        assertNotNull(result);  // Then
        assertTrue(result.length > 0);  // Then
    }

    @Test
    void generateQRCodeImage_shouldGenerateCorrectQRCodeForGivenPlaceId() throws Exception {
        UUID placeId = UUID.randomUUID();  // Given
        String expectedData = placeId.toString();
        byte[] result = qrCodeService.generateQRCodeImage(placeId);  // When
        assertNotNull(result);  // Then
        assertTrue(result.length > 0);  // Then
    }

    @Test
    void generateQRCodeImage_shouldThrowExceptionWhenPlaceIdIsNull() {
        UUID placeId = null;  // Given
        assertThrows(Exception.class, () -> qrCodeService.generateQRCodeImage(placeId));  // When & Then
    }

    @Test
    void generateQRCodeImage_shouldHandleInvalidQRCodeGeneration() throws Exception {

    }
}
