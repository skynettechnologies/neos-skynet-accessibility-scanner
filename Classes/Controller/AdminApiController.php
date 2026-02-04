<?php
namespace Skynettechnologies\Skynetaccessibilityscanner\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Security\Context;
use Neos\Neos\Domain\Repository\UserRepository;

class AdminApiController extends ActionController
{
    /**
     * @Flow\Inject
     */
    protected Context $securityContext;

    /**
     * @Flow\Inject
     */
    protected UserRepository $userRepository;

    /**
     * @Flow\SkipCsrfProtection
     */
    public function infoAction(): void
    {
        $account = $this->securityContext->getAccount();
        $username = '';
        $email = '';

        if ($account) {
            $user = $this->userRepository->findOneByAccount($account);
            if ($user && $user->getPerson()) {
                $person = $user->getPerson();
                $email = $person->getPrimaryElectronicAddress()
                    ? $person->getPrimaryElectronicAddress()->getIdentifier()
                    : '';
                $username = trim(
                    ($person->getName()->getFirstName() ?? '') . ' ' .
                    ($person->getName()->getLastName() ?? '')
                );
            }
        }
        $this->response->setHeader('Content-Type', 'application/json');
        $this->response->setContent(json_encode([
            'name' => $username,
            'email' => $email
        ]));
    }
}
