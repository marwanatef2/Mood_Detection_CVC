from smile import calc_video_score
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

score = calc_video_score('test.avi', 10, 50)
print("final score: ", score)


# import numpy as np
# import cv2

# cap = cv2.VideoCapture(0)

# # Define the codec and create VideoWriter object
# fourcc = cv2.VideoWriter_fourcc(*'XVID')
# out = cv2.VideoWriter('test.avi', fourcc, 20.0, (640, 480))

# while(cap.isOpened()):
#     ret, frame = cap.read()
#     if ret == True:
#         out.write(frame)

#         cv2.imshow('frame', frame)
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break
#     else:
#         break

# # Release everything if job is finished
# cap.release()
# out.release()
# cv2.destroyAllWindows()
