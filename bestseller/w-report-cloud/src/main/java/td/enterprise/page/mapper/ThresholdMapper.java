package td.enterprise.page.mapper;

import org.springframework.stereotype.Component;

import td.enterprise.entity.Threshold;
import td.enterprise.web.vm.ThresholdVM;

@Component
public class ThresholdMapper {

    public Threshold thresholdVMToThreshold(ThresholdVM thresholdVM) {

    	Threshold threshold = new Threshold();

        if (thresholdVM == null) {
            return threshold;
        }

        threshold.setId(thresholdVM.getId());
        threshold.setProjectId(thresholdVM.getProjectId());
        threshold.setCrowdActiveHighBegin(thresholdVM.getCrowdActiveHighBegin());
        threshold.setCrowdActiveHighEnd(thresholdVM.getCrowdActiveHighEnd());
        threshold.setCrowdActiveLowBegin(thresholdVM.getCrowdActiveLowBegin());
        threshold.setCrowdActiveLowEnd(thresholdVM.getCrowdActiveLowEnd());
        threshold.setCrowdActiveMediumBegin(thresholdVM.getCrowdActiveMediumBegin());
        threshold.setCrowdActiveMediumEnd(thresholdVM.getCrowdActiveMediumEnd());
        threshold.setCrowdBounce(thresholdVM.getCrowdBounce());
        threshold.setCrowdCome(thresholdVM.getCrowdCome());
        threshold.setCrowdSleep(thresholdVM.getCrowdSleep());
        threshold.setCrowdStay(thresholdVM.getCrowdStay());
        threshold.setStrengthCrowdBefore(thresholdVM.getStrengthCrowdBefore());
        threshold.setStrengthCrowdCome(thresholdVM.getStrengthCrowdCome());
        threshold.setFrequencyIntervalTime(thresholdVM.getFrequencyIntervalTime());
        threshold.setSalesComeDay(thresholdVM.getSalesComeDay());
        threshold.setSalesConsecutiveDay(thresholdVM.getSalesConsecutiveDay());
        threshold.setSalesStayTime(thresholdVM.getSalesStayTime());
        threshold.setBlackComeDay(thresholdVM.getBlackComeDay());
        threshold.setBlackConsecutiveDay(thresholdVM.getBlackConsecutiveDay());
        threshold.setBlackStayTime(thresholdVM.getBlackStayTime());

        return threshold;
    }
    
    public ThresholdVM thresholdToThresholdVM(Threshold threshold) {

    	ThresholdVM thresholdVM = new ThresholdVM();

        if (threshold == null) {
            return thresholdVM;
        }

		thresholdVM.setId(threshold.getId());
        thresholdVM.setProjectId(threshold.getProjectId());
        thresholdVM.setCrowdActiveHighBegin(threshold.getCrowdActiveHighBegin());
        thresholdVM.setCrowdActiveHighEnd(threshold.getCrowdActiveHighEnd());
        thresholdVM.setCrowdActiveLowBegin(threshold.getCrowdActiveLowBegin());
        thresholdVM.setCrowdActiveLowEnd(threshold.getCrowdActiveLowEnd());
        thresholdVM.setCrowdActiveMediumBegin(threshold.getCrowdActiveMediumBegin());
        thresholdVM.setCrowdActiveMediumEnd(threshold.getCrowdActiveMediumEnd());
        thresholdVM.setCrowdBounce(threshold.getCrowdBounce());
        thresholdVM.setCrowdCome(threshold.getCrowdCome());
        thresholdVM.setCrowdSleep(threshold.getCrowdSleep());
        thresholdVM.setCrowdStay(threshold.getCrowdStay());
        thresholdVM.setStrengthCrowdBefore(threshold.getStrengthCrowdBefore());
        thresholdVM.setStrengthCrowdCome(threshold.getStrengthCrowdCome());
        thresholdVM.setFrequencyIntervalTime(threshold.getFrequencyIntervalTime());
        thresholdVM.setSalesComeDay(threshold.getSalesComeDay());
        thresholdVM.setSalesConsecutiveDay(threshold.getSalesConsecutiveDay());
        thresholdVM.setSalesStayTime(threshold.getSalesStayTime());
        thresholdVM.setBlackComeDay(threshold.getBlackComeDay());
        thresholdVM.setBlackConsecutiveDay(threshold.getBlackConsecutiveDay());
        thresholdVM.setBlackStayTime(threshold.getBlackStayTime());

        return thresholdVM;
    }

}

