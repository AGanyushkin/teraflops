import java.util.*;
import static java.lang.Double.NaN;
import static java.lang.Double.POSITIVE_INFINITY;
import static java.lang.Double.NEGATIVE_INFINITY;

public class Test_NaN {
    public static void main(String args[]) {
        double[] allNaNs = {
                0D/0D,
                POSITIVE_INFINITY / POSITIVE_INFINITY,
                POSITIVE_INFINITY / NEGATIVE_INFINITY,
                NEGATIVE_INFINITY / POSITIVE_INFINITY,
                NEGATIVE_INFINITY / NEGATIVE_INFINITY,
                0 * POSITIVE_INFINITY,
                0 * NEGATIVE_INFINITY,
                Math.pow(1, POSITIVE_INFINITY),
                POSITIVE_INFINITY + NEGATIVE_INFINITY,
                NEGATIVE_INFINITY + POSITIVE_INFINITY,
                POSITIVE_INFINITY - POSITIVE_INFINITY,
                NEGATIVE_INFINITY - NEGATIVE_INFINITY,
                Math.sqrt(-1),
                Math.log(-1),
                Math.asin(-2),
                Math.acos(+2),
        };
        System.out.println(Arrays.toString(allNaNs));
        // prints "[NaN, NaN...]"
        System.out.println(NaN == NaN); // prints "false"
        System.out.println(Double.isNaN(NaN)); // prints "true"
        System.out.println(NaN + 1); // prints "NaN"
        System.out.println(NaN * 1); // prints "NaN"
    }
}
