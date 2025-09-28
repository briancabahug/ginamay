FROM ubuntu:18.04
RUN apt update \
  && apt install -y firefox \
                    openssh-server \
                    xauth \
  && mkdir /var/run/sshd \
  && mkdir /root/.ssh \
  && chmod 700 /root/.ssh \
  && ssh-keygen -A \
  && sed -i "s/^.*PasswordAuthentication.*$/PasswordAuthentication no/" /etc/ssh/sshd_config \
  && sed -i "s/^.*X11Forwarding.*$/X11Forwarding yes/" /etc/ssh/sshd_config \
  && sed -i "s/^.*X11UseLocalhost.*$/X11UseLocalhost no/" /etc/ssh/sshd_config \
  && grep "^X11UseLocalhost" /etc/ssh/sshd_config || echo "X11UseLocalhost no" >> /etc/ssh/sshd_config

RUN echo "<insert ssh pub key here" >> /root/.ssh/authorized_keys

EXPOSE 22
ENTRYPOINT ["sh", "-c", "/usr/sbin/sshd && tail -f /dev/null"]
