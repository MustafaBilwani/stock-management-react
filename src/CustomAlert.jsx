import { Alert, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react";
import React from "react";

function CustomAlert({isOpen, onConfirm, onClose, alertHeading, alertText, type, onDiscard}){
  const cancelRef = React.useRef()

  return(
    <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {alertHeading}
            </AlertDialogHeader>

            <AlertDialogBody>
              {alertText}
            </AlertDialogBody>

            <AlertDialogFooter>
                {type === 'saveOrDiscard' ? (
                  <>
                    <Button ref={cancelRef} onClick={onDiscard} colorScheme="red">
                      Discard
                    </Button>
                    <Button onClick={onConfirm} ml={3} colorScheme="blue">
                      Confirm
                    </Button>
                  </>
                ) : (
                  <>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme='red' onClick={onConfirm} ml={3}>
                      Delete
                    </Button>
                  </>
                )}
              
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
  )
}

export default CustomAlert