package com.softserve.edu.service.verification;

import com.softserve.edu.entity.Verification;
import com.softserve.edu.entity.user.User;
import com.softserve.edu.entity.util.ReadStatus;
import com.softserve.edu.entity.util.Status;
import com.softserve.edu.repository.UserRepository;
import com.softserve.edu.repository.VerificationRepository;
import com.softserve.edu.service.utils.CountOfWork;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Maksym.Hirnyak on 12.07.2015.
 */
@Service
public class VerificationProviderEmployeeService {

    Logger logger = Logger.getLogger(VerificationProviderEmployeeService.class);

    @Autowired
    private VerificationRepository verificationRepository;

    @Autowired
    private UserRepository userRepository;


    @Transactional
    public void assignProviderEmployee(String verificationId, User providerEmployee, String countOfWork) {
        Verification verification = verificationRepository.findOne(verificationId);
        if (verification == null) {
            logger.error("verification haven't found");
            return;
        }
        if (countOfWork.equals(CountOfWork.Increment.name())) {
            verification.setProviderEmployee(providerEmployee);
            verification.setStatus(Status.SENT);
        } else {
            verification.setProviderEmployee(null);
            verification.setStatus(Status.SENT);
        }
        verification.setReadStatus(ReadStatus.READ);
        countOfProviderEmployeeWork(providerEmployee.getUsername(), countOfWork);
        verificationRepository.save(verification);
    }


    @Transactional
    public Long countByProviderEmployeeTasks(String username) {
        return userRepository.getCountOfWork(username);
    }

    /**
     * this method calculate work of ProviderEmployee
     *
     * @param username
     * @param statusOfWork
     */
    @Transactional
    public void countOfProviderEmployeeWork(String username, String statusOfWork) {
        User providerEmployee = userRepository.getUserByUserName(username);
        Long count = providerEmployee.getCountOfWork();
        long work = (count == null) ? 0 : count;
        if (statusOfWork.equals(CountOfWork.Increment.name())) {
            providerEmployee.setCountOfWork(++work);
        } else {
            providerEmployee.setCountOfWork(--work);
        }
        userRepository.save(providerEmployee);

    }

    /**
     * This method search in Verification table ProviderEmployee by verification Id
     *
     * @param idVerification
     * @return ProviderEmployee
     */
    @Transactional
    public User getProviderEmployeeById(String idVerification) {
        return verificationRepository.getProviderEmployeeById(idVerification);
    }


    @Transactional
    public List<Verification> getVerificationListbyProviderEmployee(String username) {
        return verificationRepository.findByProviderEmployeeUsernameAndStatus(username, Status.SENT);
    }
}