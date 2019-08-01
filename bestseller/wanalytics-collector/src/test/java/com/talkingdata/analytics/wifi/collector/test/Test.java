package com.talkingdata.analytics.wifi.collector.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Created by loong on 4/14/16.
 */
public class Test {
    public static void main(String[] args) {
        doOffLineTest();
    }

    private static void doOffLineTest() {
        String str = "{\"data\":[\"AQAAbAAA5JVuT/DsTmkVoQAAAAvDAXifcNryJrgCaF1" +
                "DomfhtgKMNP0OMdepAlCnK/IcKrwCDmlsT7QsvQMGaWxPtCyvAtTuByGp+NEBYFcYdRQNswJIUbd9JdW6Aji8Ghk" +
                "B08gBkEiaxacf\",\"AQAAhAAA5JVuT/DsTmkVpAAAAA7RAWBXGHUUDbICSFG3fSXVyQGQSJrFpx+zAvAlt+kfQr" +
                "gCaF1DomfhvQIOaWxPtCy2Aow0/Q4x18QBeJ9w2vImrwLU7gchqfivAjxG2LoIXawCGM9eA3z8qALosfyvdo63AmB" +
                "nIC/y/LECGM9eZ/a6\",\"AQAAvAAA5JVuT/DsTmkVpwAAABWpAuix/K92jtMBYFcYdRQNuQJoXUOiZ+G9Ag5pbE+" +
                "0LLICSFG3fSXVxwMkdwPLG/iwAtTuByGp+MUBeJ9w2vImtgJoPjRWr6StAmg+NCtWJr0DOLwaRb6KrQI8Rti6CF3D" +
                "A0hFIGYc8MIDrM8jWmcWqwIgFti+gp20AqzPXNP8LskBkEiaxacfsAIYz15n9rq3Aow0/Q4x18ADwO77RuQlygE4v" +
                "BrLW30=\",\"AQAAzAAA5JVuT/DsTmkVqgAAABfHAZBImsWnH7QCrM9c0/wuzQEOaWxPtLO1Aow0/Q4x160CDmlsJ" +
                "JKmuQJoXUOiZ+G9Ag5pbE+0LLQComQpITKM0QFgVxh1FA2uAtTuByGp+LcCwO77ATrRxgF4n3Da8iaxAiAW2L6Cnag" +
                "CvDrqEC/HygE4vBrLW32uAjxG2LoIXcQDTDSIGHZxrgJYRJjlZoumApjxcIXe+8IDrM8jWmcWrQLcNxRMr2i9AgZpb" +
                "E+0LK8CaD40K1Ym\",\"AQAA3AAA5JVuT/DsTmkVrQAAABnIAZBImsWnH7oCOLwaGQHTxAF4n3Da8ia+A8Rqt6Py1bg" +
                "CIBbYvoKdwwN0UbpTcl+vAtTuByGp+KoCoIbGnfU9vAIGaWxPtCypAuix/K92js8BYFcYdRQNuAJoXUOiZ+G7Ag5pbE" +
                "+0LKwCwMz4QtkNrQIOaWwkkqapAlCnK/IcKrsDSEUgZhnfrgI8Rti6CF2xAkhRt30l1bgCjDT9DjHXtgKsz4XKsGnJ" +
                "ATi8GstbfaYCJAmVUQPHtgJoPjRWr6S9A2gXKQVtEA==\",\"AQAAlAAA5JVuT/DsTmkVsAAAABC7A2gXKQVtELYCaF" +
                "1DomfhywFgVxh1FA2pAuix/K92jq4C1O4HIan4sQJoPjQrVia7Ag5pbE+0LLECzD2CRcDgrwJIUbd9JdXJATi8Gstbf" +
                "b0CrM8jWmbctgJoPjRWr6TCA4y+vviCQMcBkEiaxacftAKMNP0OMderAg5pbCSSpg==\",\"AQAAjAAA5JVuT/DsTmkV" +
                "swAAAA+7Ag5pbE+0LLcCaF1DomfhrgLU7gchqfioAuix/K92js0BYFcYdRQNtAKsz4XKsGmvAjxG2LoIXbMCwO77ATrRw" +
                "QF4n3Da8iavAkhRt30l1cYBkEiaxacfqAJQpyvyHCq4AgZpbE96z7ACfMOhOpcyowK4dj8lY2c=\",\"AQAAtAAA5JV" +
                "uT/DsTmkVtgAAABS7Ag5pbE+0LLYCaF1DomfhwAF4n3Da8ibOAWBXGHUUDa8C1O4HIan4tgJ4+IKjizWvAmDnAVlDYbg" +
                "COLwaGQHTtAKMNP0OMde6AgZpbE+0LK4CPEbYughdrAJYRJjlZouqAg5pbCSSpq8CSFG3fSXVswJolCMPwMbIAZBImsW" +
                "nH6kC6LH8r3aOtAJoPjRWr6S4AiAW2L6CnaoCoIbGnfU9\",\"AQAAlAAA5JVuT/DsTmkVuQAAABCwAmiUIw/Axs0BYF" +
                "cYdRQNugIOaWxPtCy1AqzPhcqwaa8CSFG3fSXVrwLU7gchqfioAuix/K92jrYCaF1DomfhrQI8Rti6CF2qAngMuNNrG7" +
                "MCaD40Vq+ktwJgbGZZcy7IAZBImsWnH6UCgHF6jCUxtgJ4+IKjizXRAYQ6SzNutA==\",\"AQAAlAAA5JVuT/DsTmkVv" +
                "AAAABCvAtTuByGp+LYCaF1Domfh0AGEOkszbrS5Ag5pbE+0LKMCFHWQWo70rgJIUbd9JdXNAWBXGHUUDaoCXODF7YJEq" +
                "ALosfyvdo6qAg5pbCSSps4BrM8jWmWkrQI8Rti6CF20AqzPhcqwabgCBmlsT3rPyQGQSJrFpx+zAsDu+wE60Q==\"],\"" +
                "ts\":1,\"version\":\"1.1\",\"datatype\":\"rssi\"}";
        System.out.println(TalkingDataHttpClient.doGzipPost("http://localhost:8080/g/o", str));
    }
}
