package assignment2;

import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.StringSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.List;
import java.util.Properties;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;

public class Producer {
    public static void main(String[] args) {

        final Logger logger = LoggerFactory.getLogger(Producer.class);
        
        if (args.length<1) {
            logger.error("Usage: Producer [path/to/csv]");
            return;
        }

        CSVReader reader = null;
        List<String[]> rows;
        try {
            reader = new CSVReader(new FileReader(args[0]));
            rows = reader.readAll();
        }
        catch (FileNotFoundException e) {
            logger.error("Error opening file", e);
            return;
        }
        catch (CsvException e) {
            logger.error("CSV error", e);
            return;
        }
        catch (Exception e) {
            logger.error("Exception", e);
            return;
        }

        Properties properties = new Properties();
        properties.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "127.0.0.1:9092");
        properties.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        properties.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        KafkaProducer<String, String> producer = new KafkaProducer<String, String>(properties);

        for (String[] row : rows) {
            if (row.length<2) {
                logger.warn("Row has less than 2 args, skipping...");
            }
            ProducerRecord<String, String> record = new ProducerRecord<String, String>("csv_topic", row[0], row[1]);
            producer.send(record, new Callback() {
                public void onCompletion(RecordMetadata recordMetadata, Exception e) {
                    if (e == null) {
                        logger.info("Received new metadata \n" +
                                "Topic: " + recordMetadata.topic() + "\n" +
                                "Partition: " + recordMetadata.partition() + "\n" +
                                "Offset: " + recordMetadata.offset() + "\n" +
                                "Timestamp: " + recordMetadata.timestamp());
                    } else {
                        logger.error("Error while producing", e);
                    }
                }
            });
        }
        producer.close();
    }
}
