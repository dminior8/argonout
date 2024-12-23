package pl.dminior.backend_argonout.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.util.Hashtable;
import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.util.UUID;

@Service
public class QRCodeServiceImpl implements QRCodeService {
    private static final int WIDTH = 300;
    private static final int HEIGHT = 300;

    @Override
    public byte[] generateQRCodeImage(UUID placeId) throws Exception {
        String data =  placeId.toString();

        Hashtable<EncodeHintType, String> hints = new Hashtable<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

        BitMatrix bitMatrix = new MultiFormatWriter().encode(data, BarcodeFormat.QR_CODE, WIDTH, HEIGHT, hints);

        BufferedImage bufferedImage = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
        bufferedImage.createGraphics().fillRect(0, 0, WIDTH, HEIGHT);

        for (int x = 0; x < WIDTH; x++) {
            for (int y = 0; y < HEIGHT; y++) {
                bufferedImage.setRGB(x, y, bitMatrix.get(x, y) ? Color.BLACK.getRGB() : Color.WHITE.getRGB());
            }
        }

        // Zamiana na tablicę bajtów (np. do przesyłania w odpowiedzi HTTP)
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "PNG", baos);
        return baos.toByteArray();
    }
}

